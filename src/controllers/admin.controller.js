import Admin from "../models/admin.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import token from "../utils/Token.js";
import config from "../config/index.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/succes-res.js";

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

    async signIn(req, res) {
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

    async generateNewToken(req, res) {
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

    async signOut(req, res) {
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
            return successRes(res, {})
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();
