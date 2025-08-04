import { join } from "path";
import { existsSync, unlinkSync } from "fs";

import { AppError } from "../error/AppError.js";
import Client from "../models/client.model.js";
import crypto from "../utils/Crypto.js";
import { successRes } from "../utils/succes-res.js";
import { BaseController } from "./base.controller.js";
import token from "../utils/Token.js";
import redis from "../utils/Redis.js";
import { sendToOTP } from "../utils/send-mail.js";
import { generateOTP } from "../utils/generate-OTP.js";

class ClientController extends BaseController {
    constructor() {
        super(Client, [
            {
                path: "orders",
                populate: {
                    path: "courseId",
                    populate: [{ path: "owner" }, { path: "category" }],
                },
            },
        ]);
    }

    async createClient(req, res) {
        try {
            const { email, phoneNumber, password } = req.body;

            const existstsEmail = await Client.findOne({ email });
            if (existstsEmail) {
                throw new AppError("email already exists", 409);
            }

            const existsPhone = await Client.findOne({ phoneNumber });
            if (existsPhone) {
                throw new AppError("Phone number already exists", 409);
            }
            const hashedPassword = await crypto.encrypt(password);
            const OTP = generateOTP();
            redis.setData(
                email,
                JSON.stringify({
                    otp: OTP,
                    source: "register",
                    tempClient: {
                        ...req.body,
                        hashedPassword,
                        image: `/uploads/images/${req.file.filename ?? ''}`

                    },
                })
            );
            sendToOTP(email, OTP);

            return successRes(res, {
                
                email,
                exprin: "3 minutes",
                confirmOTP: "127.0.1:2000/api/client/confirm-otp",
                requestMethod: "PATCH",
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }

    async updateClient(req, res, next) {
        try {
            const id = req.params?.id;
            const client = await BaseController.checkId(Client, id);

            const { username, email, password } = req.body;

            // 🔐 Username tekshiruvi
            if (username && username !== client.username) {
                const exists = await Client.findOne({ username });
                if (exists) {
                    throw new AppError("Username already exists", 409);
                }
            }

            // 🔐 Email tekshiruvi
            if (email && email !== client.email) {
                const exists = await Client.findOne({ email });
                if (exists) {
                    throw new AppError("Email address already exists", 409);
                }
            }

            // 🔐 Parol yangilash
            let hashedPassword = client.hashedPassword;
            if (password) {
                if (req.user?.role !== client.role) {
                    throw new AppError(
                        "Not access to change password for client",
                        403
                    );
                }
                hashedPassword = await crypto.encrypt(password);
                delete req.body.password;
            }

            // 📸 Rasm yangilash
            let image = client.image;
            if (req.file?.filename) {
                const oldPath = join(
                    process.cwd(),
                    "../uploads/images",
                    client.image?.split("/").pop()
                );
                if (existsSync(oldPath)) unlinkSync(oldPath);

                image = `/uploads/images/${req.file.filename}`;
            }

            // 🆕 Yangilash
            const updatedClient = await Client.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    hashedPassword,
                    image,
                },
                { new: true }
            );

            return successRes(res, updatedClient);
        } catch (error) {
            next(error);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const client = await Client.findOne({ email });
            const isMatchPassword = await crypto.decrypt(
                password,
                client?.hashedPassword ?? ""
            );
            if (!isMatchPassword) {
                throw new AppError("Username or password incorrect", 400);
            }

            const playload = {
                id: client.id,
                role: client.role,
                isActive: client.isActive,
            };

            const accessToken = token.generateAccessToken(playload);
            const refreshToken = token.generateRefreshToken(playload);
            token.writeToCookie(res, "refreshTokenClient", refreshToken, 30);
            return successRes(res, {
                token: accessToken,
                client,
            });
        } catch (error) {
            next(error);
        }
    }
    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenClient;
            if (!refreshToken) {
                throw new AppError("refresh token not found", 401);
            }
            const verifiedToken = token.verifyToken(
                refreshToken,
                config.Token.Refresh_Token_Key
            );
            if (!verifiedToken) {
                throw new AppError("refresh token expire", 401);
            }
            const client = await Client.findById(verifiedToken?.id);
            if (!client) {
                throw new AppError("forbidden user", 403);
            }
            const playload = {
                id: client._id,
                role: client.role,
                isActive: client.isActive,
            };
            const accessToken = token.generateAccessToken(playload);
            return successRes(res, {
                token: accessToken,
                client,
            });
        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenClient;
            if (!refreshToken) {
                throw new AppError("refresh tooken not found", 401);
            }

            const verifiedToken = token.verifyToken(
                refreshToken,
                config.Token.Refresh_Token_Key
            );
            if (!verifiedToken) {
                throw new AppError("refresh token expire", 401);
            }
            const client = await Client.findById(verifiedToken?.id);
            if (!client) {
                throw new AppError("forbidden user", 403);
            }
            res.clearCookie("refreshTokenClient");
            Client.findByIdAndUpdate(client._id, { isActive: false });
            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    }

    async forgetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const exists = await Client.findOne({ email });
            if (!exists) {
                throw new AppError("email address is not found", 404);
            }

            const OTP = generateOTP();
            sendToOTP(email, JSON.stringify({ otp: OTP, source: "" }));
            redis.setData(email, OTP);
            return successRes(res, {
                email,
                exprin: "3 minutes",
                confirmOTP: "127.0.1:2000/api/client/confirm-otp",
                requestMethod: "PATCH",
            });
        } catch (error) {
            next(error);
        }
    }

    async confirmOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            const checkOTP = await redis.getData(email);

            if (!checkOTP) throw new AppError("OTP expired or expired");

            const { otp: savedOTP, source, tempClient } = JSON.parse(checkOTP);

            if (otp !== savedOTP)
                throw new AppError("OTP is incorrect or expired", 400);

            await redis.deleteData(email);
            if (source === "register") {
                const created = await Client.create(tempClient);
                return successRes(
                    res,
                    {
                        message: "Registration confirmed successfully",
                        client: created,
                    },
                    201
                );
            }

            return successRes(res, {
                confirmPasswordUrl: "127.0.1:2000/api/client/confirm-password",
                requestMethod: "PATCH",
                email,
            });
        } catch (error) {
            next(error);
        }
    }

    async confirmPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;
            const client = await Client.findOne({ email });
            if (!client) {
                throw new AppError("email address is not found", 404);
            }
            const hashedPassword = await crypto.encrypt(newPassword);
            const updatedClient = await Client.findByIdAndUpdate(
                client._id,
                { hashedPassword },
                { new: true }
            );

            return successRes(res, updatedClient);
        } catch (error) {
            next(error);
        }
    }
}

export default new ClientController();
