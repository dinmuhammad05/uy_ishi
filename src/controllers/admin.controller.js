import Admin from "../models/admin.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import token from "../utils/Token.js";
import config from "../config/index.js";

class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }

    async creatAdmin(req, res) {
        try {
            const { userName, email, password } = req.body;
            const existsUserName = await Admin.findOne({ userName });

            if (existsUserName) {
                return res.status(409).json({
                    statusCode: 409,
                    message: "user name already exists",
                });
            }

            const existsEmail = await Admin.findOne({ email });
            if (existsEmail) {
                return res.status(409).json({
                    statusCode: 409,
                    message: "email already exists",
                });
            }
            const hashedPassword = await crypto.encrypt(password);

            const newAdmin = await Admin.create({
                userName,
                email,
                hashedPassword,
            });
            
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: newAdmin,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
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
                return res.status(400).json({
                    statusCode: 400,
                    message: "Username or password incorrect",
                });
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

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: {
                    token: accessToken,
                    admin,
                },
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }

    async generateNewToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "refresh token not found",
                });
            }
            const verifiedToken = token.verifyToken(
                refreshToken,
                config.Token.Refresh_Token_Key
            );
            if (!verifiedToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "refresh token expire",
                });
            }
            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                return res.status(403).json({
                    statusCode: 403,
                    message: "Forbidden user",
                });
            }
            const playload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.isActive,
            };
            const accessToken = token.generateAccessToken(playload);
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: {
                    token: accessToken,
                },
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }

    async signOut(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "refresh tooken not found",
                });
            }

            const verifiedToken = token.verifyToken(
                refreshToken,
                config.Token.Refresh_Token_Key
            );
            if (!verifiedToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "refresh token expire",
                });
            }
            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                return res.status(403).json({
                    statusCode: 403,
                    message: "forbidden user",
                });
            }
            res.clearCookie("refreshTokenAdmin");
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: {},
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }
}

export default new AdminController();