import { AppError } from "../error/AppError.js";
import Owner from "../models/owner-course.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import { successRes } from "../utils/succes-res.js";
import token from '../utils/Token.js'
import config from "../config/index.js";

class OwnerController extends BaseController {
    constructor() {
        super(Owner);
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
                image: req?.file?.filename ?? "",
            });
            return successRes(res, newOwner, 201);
        } catch (error) {
            next(error);
        }
    }

    async signin(req, res, next) {
        try {
            const { username, password } = req.body;

            const owner = await Owner.findOne({ username });
            const isMatched = await crypto.decrypt(password, owner?.hashedPassword ?? '');

            if (!isMatched) {
                throw new AppError('username or password incorrect');
            }

            const payload = {
                id: owner._id,
                role: owner?.role,
                isActive: owner.isActive
            };

            const accessToken = token.generateAccessToken(payload);
            const refershToken = token.generateRefreshToken(payload);
            token.writeToCookie(res, "refreshTokenOwner", refershToken, 30);

            return successRes(res, { token: accessToken, owner })
        } catch (error) {
            next(error)
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
}

export default new OwnerController();