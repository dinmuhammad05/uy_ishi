import { AppError } from "../error/AppError.js";
import Owner from "../models/owner-course.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import { successRes } from "../utils/succes-res.js";
import token from "../utils/Token.js";
import config from "../config/index.js";
import redis from "../utils/Redis.js";

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
            const newOwner = Owner.create({
                ...req.body,
                hashedPassword,
                image: req?.file?.path ?? "",
            });
            return successRes(res, newOwner, 201);
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
