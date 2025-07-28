import Admin from "../models/admin.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import token from "../utils/Token.js";
import config from "../config/index.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/succes-res.js";
import { generateOTP } from "../utils/generate-OTP.js";
import redis from "../utils/Redis.js";
import { sendToOTP } from "../utils/send-mail.js";

class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }

    async creatAdmin(req, res, next) {
        try {
            const { userName, email, password } = req.body;
            const existsUserName = await Admin.findOne({ userName });

            if (existsUserName) {
                throw new AppError("user name already exists", 409);
            }

            const existsEmail = await Admin.findOne({ email });
            if (existsEmail) {
                throw new AppError("email already exists", 409);
            }
            const hashedPassword = await crypto.encrypt(password);

            const newAdmin = await Admin.create({
                userName,
                email,
                hashedPassword,
            });

            return successRes(res, newAdmin, 201);
        } catch (error) {
            next(error);
        }
    }

    async signIn(req, res, next) {
        try {
            const { userName, password } = req.body;
            const admin = await Admin.findOne({ userName });
            const isMatchPassword = await crypto.decrypt(
                password,
                admin?.hashedPassword ?? ""
            );
            if (!isMatchPassword) {
                throw new AppError("Username or password incorrect", 400);
            }

            const playload = {
                id: admin.id,
                role: admin.role,
                isActive: admin.isActive,
            };

            const accessToken = token.generateAccessToken(playload);
            const refreshToken = token.generateRefreshToken(playload);
            token.writeToCookie(
                res,
                config.Token.Refresh_Token_Key,
                refreshToken,
                30
            );

            return successRes(res, {
                token: accessToken,
                admin,
            });
        } catch (error) {
            next(error);
        }
    }

    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
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
            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                throw new AppError("forbidden user", 403);
            }
            const playload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.isActive,
            };
            const accessToken = token.generateAccessToken(playload);
            return successRes(res, {
                token: accessToken,
                admin,
            });
        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
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
            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                throw new AppError("forbidden user", 403);
            }
            res.clearCookie("refreshTokenAdmin");
            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    }

    async updateAdmin(req, res, next) {
        try {
            const id = req.params.id;
            const admin = await BaseController.checkId(Admin, id);
            const { userName, email, password } = req.body;
            if (userName) {
                const exists = findOne({ userName });
                if (exists && exists.userName !== userName) {
                    throw new AppError("username already exists", 409);
                }
            }
            if (email) {
                const exists = findOne({ email });
                if (email && exists.email !== email) {
                    throw new AppError("email already exists", 409);
                }
            }
            let hashedPassword = admin.hashedPassword;
            if (password) {
                if (req.user.role != admin.role) {
                    throw new AppError("Not access to change password for admin", 403);
                }
                hashedPassword = await crypto.encrypt(password);
                delete req.body.password;
            }
            const updatedAdmin = await Admin.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    hashedPassword,
                },
                { new: true }
            );
            return successRes(res, updatedAdmin);
        } catch (error) {
            next(error);
        }
    }

    async updatePasswordforAdmin(req, res, next) {
        try {
            const id = req.params.id;
            console.log(id);

            const admin = await BaseController.checkId(Admin, id);
            console.log(admin);

            const { oldPassword, newPassword: newPassword } = req.body;
            const isMatchedPassword = await crypto.decrypt(
                oldPassword,
                admin.hashedPassword
            );
            if (!isMatchedPassword) {
                throw new AppError("incorrect old password", 400);
            }
            const hashedPassword = await crypto.encrypt(newPassword);
            const updatedAdmin = await Admin.findByIdAndUpdate(
                id,
                { hashedPassword },
                { new: true }
            );
            return successRes(res, updatedAdmin);
        } catch (error) {
            next(error);
        }
    }

    async forgetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const exists = await Admin.findOne({ email });
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
                confirmPasswordUrl: "127.0.1:2000/api/admin/confirm-password",
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
            const admin = await Admin.findOne({ email });
            if (!admin) {
                throw new AppError("email address is not found", 404);
            }
            const hashedPassword = await crypto.encrypt(newPassword);
            const updatedAdmin = await Admin.findByIdAndUpdate(
                admin._id,
                { hashedPassword },
                { new: true }
            );

            return successRes(res, updatedAdmin);
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
