import fs, { existsSync, unlinkSync } from "fs";

import { AppError } from "../error/AppError.js";
import Owner from "../models/owner-course.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import { successRes } from "../utils/succes-res.js";
import token from "../utils/Token.js";
import config from "../config/index.js";
import redis from "../utils/Redis.js";
import { generateOTP } from "../utils/generate-OTP.js";
import { sendToOTP } from "../utils/send-mail.js";
import { join } from "path";

class OwnerController extends BaseController {
    constructor() {
        super(Owner, [
            {
                path: "courses",
                populate: [{ path: "category" }, { path: "coursevideos" }],
            },
        ]);
    }

    async createOwner(req, res, next) {
        try {
            const { email, username, password } = req.body;
            const existsUsername = await Owner.findOne({ username });
            if (existsUsername) {
                throw new AppError("Username already exists", 409);
            }
            const existsEmail = await Owner.findOne({ email });
            if (existsEmail) {
                throw new AppError("Email already exists", 409);
            }
            const hashedPassword = await crypto.encrypt(password);

            const OTP = generateOTP();
            sendToOTP(email, OTP);
            await redis.setData(
                email,
                JSON.stringify({
                    otp: OTP,
                    source: "register",
                    tempOwner: {
                        ...req.body,
                        hashedPassword,
                        image: `/uploads/images/${req.file.filename ?? ""}`,
                    },
                })
            );

            return successRes(res, {
                email,
                exprin: "3 minutes",
                confirmOTP: "127.0.1:2000/api/owner/confirm-otp",
                requestMethod: "PATCH",
            });
        } catch (err) {
            // ❗ Faylni Sync tarzda o‘chirish (bloklovchi)
            if (req.file?.path) {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log("Fayl o'chirildi");
                } catch (unlinkErr) {
                    console.error(
                        "Faylni o'chirishda xato:",
                        unlinkErr.message
                    );
                }
            }

            next(err);
        }
    }

    async updateOwner(req, res, next) {
        try {
            const id = req.params.id;
            const owner = await BaseController.checkId(Owner, id);

            const { email, username, password } = req.body;

            if (username && username !== owner.username) {
                const existsUsername = await Owner.findOne({ username });
                if (existsUsername) {
                    throw new AppError("Username already exists", 409);
                }
            }

            if (email && email !== owner.email) {
                const existsEmail = await Owner.findOne({ email });
                if (existsEmail) {
                    throw new AppError("Email already exists", 409);
                }
            }

            let hashedPassword = owner.hashedPassword;
            if (password) {
                hashedPassword = await crypto.encrypt(password);
                delete req.body.password;
            }

            let image = owner.image;
            if (req.file?.filename) {
                if (owner?.image) {
                    const oldFile = owner.image.split("/").pop();
                    const oldPath = join(
                        process.cwd(),
                        "../uploads/images",
                        oldFile
                    );
                    if (existsSync(oldPath)) unlinkSync(oldPath);
                }

                image = `/uploads/images/${req.file.filename}`;
            }

            if (email) {
                const OTP = generateOTP();
                sendToOTP(email, OTP);
                await redis.setData(
                    email,
                    JSON.stringify({
                        otp: OTP,
                        source: "update",
                        tempOwner: {
                            ...req.body,
                            hashedPassword,
                            image,
                        },
                    })
                );
                return successRes(res, {
                    email,
                    exprin: "3 minutes",
                    confirmOTP: "127.0.1:2000/api/owner/confirm-otp",
                    requestMethod: "PATCH",
                });
            }

            const updatedOwner = await Owner.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    hashedPassword,
                    image,
                },
                { new: true }
            );

            return successRes(res, updatedOwner);
        } catch (error) {
            next(error);
        }
    }

    async signin(req, res, next) {
        try {
            const { username, password } = req.body;

            const owner = await Owner.findOne({ username });
            const isMatched = await crypto.decrypt(
                password,
                owner?.hashedPassword ?? ""
            );

            if (!isMatched) {
                throw new AppError("username or password incorrect");
            }

            const payload = {
                id: owner._id,
                role: owner?.role,
                isActive: owner.isActive,
            };

            const accessToken = token.generateAccessToken(payload);
            const refershToken = token.generateRefreshToken(payload);
            token.writeToCookie(res, "refreshTokenOwner", refershToken, 30);

            return successRes(res, { token: accessToken, owner });
        } catch (error) {
            next(error);
        }
    }

    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenOwner;
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
            const owner = await Owner.findById(verifiedToken?.id);
            if (!owner) {
                throw new AppError("forbidden user", 403);
            }
            const playload = {
                id: owner._id,
                role: owner.role,
                isActive: owner.isActive,
            };
            const accessToken = token.generateAccessToken(playload);
            return successRes(res, {
                token: accessToken,
                owner,
            });
        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenOwner;
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
            const owner = await Owner.findById(verifiedToken?.id);
            if (!owner) {
                throw new AppError("forbidden user", 403);
            }
            res.clearCookie("refreshTokenOwner");
            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    }

    async forgetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const exists = await Owner.findOne({ email });
            if (!exists) {
                throw new AppError("email address is not found", 404);
            }

            const OTP = generateOTP();
            sendToOTP(email, OTP);
            redis.setData(email, JSON.stringify({ otp: OTP, source: "" }));
            return successRes(res, {
                email,
                OTP,
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

            if (!checkOTP) throw new AppError("OTP expired or expired");

            const { otp: savedOTP, source, tempOwner } = JSON.parse(checkOTP);

            if (otp !== savedOTP)
                throw new AppError("OTP is incorrect or expired");

            await redis.deleteData(email);

            if (source === "register") {
                const created = await Owner.create(tempOwner);
                return successRes(
                    res,
                    {
                        message: "Registration confirmed successfully",
                        client: created,
                    },
                    201
                );
            }

            if (source === "update") {
                const updated = await Owner.findByIdAndUpdate(id, tempOwner, {
                    new: true,
                });
                return successRes(res, {
                    message: "Updating and Registration confirmed successfully",
                    client: updated,
                });
            }

            return successRes(res, {
                confirmPasswordUrl: "127.0.1:2000/api/owner/confirm-password",
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
            const owner = await Owner.findOne({ email });
            if (!owner) {
                throw new AppError("email address is not found", 404);
            }
            const hashedPassword = await crypto.encrypt(newPassword);
            const updatedAdmin = await Admin.findByIdAndUpdate(
                owner._id,
                { hashedPassword },
                { new: true }
            );

            return successRes(res, updatedAdmin);
        } catch (error) {
            next(error);
        }
    }
}

export default new OwnerController();