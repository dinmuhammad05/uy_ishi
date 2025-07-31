import { AppError } from "../error/AppError.js";
import Client from "../models/client.model.js";
import crypto from "../utils/Crypto.js";
import { successRes } from "../utils/succes-res.js";
import { BaseController } from "./base.controller.js";
import token from "../utils/Token.js";
import redis from "../utils/Redis.js";
import { sendToOTP } from "../utils/send-mail.js";

class ClientController extends BaseController {
    constructor() {
        super(Client, []);
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
            const newClient = await Client.create({
                ...req.body,
                hashedPassword,
            });
            return successRes(res, newClient, 201);
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
            if (username) {
                const exists = await Client.findOne({ username });
                if (exists && exists.username !== username) {
                    throw new AppError("Username already exists", 409);
                }
            }
            if (email) {
                const exists = await Client.findOne({ email });
                if (exists && exists.email !== email) {
                    throw new AppError("Email address already exists", 409);
                }
            }
            let hashedPassword = admin.hashedPassword;
            if (password) {
                if (req.user?.role != client.role) {
                    throw new AppError(
                        "Not access to change password for c;ient",
                        403
                    );
                }
                hashedPassword = await crypto.encrypt(password);
                delete req.body.password;
            }
            const updatedClient = await Client.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    hashedPassword,
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
            await Client.findByIdAndUpdate(client._id, { isActive: true });
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

            const otp = generateOTP();
            sendToOTP(email, otp);
            redis.setData(email, otp);
            return successRes(res, {
                email,
                otp,
                exprin: "3 minutes",
            });
        } catch (error) {
            next(error);
        }
    }

    async confirmOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            const checkOTP = await redis.getData(email);

            if (checkOTP !== otp) {
                throw new AppError("OTP expired or expired");
            }
            await redis.deleteData(email);
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
