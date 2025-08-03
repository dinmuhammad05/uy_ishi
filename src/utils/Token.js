import jwt from "jsonwebtoken";
import config from "../config/index.js";

class Token {
    generateAccessToken(payload) {
        return jwt.sign(payload, config.Token.Access_Token_Key, {
            expiresIn: config.Token.Access_Token_Time,
        });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, config.Token.Refresh_Token_Key, {
            expiresIn: config.Token.Refresh_Token_Time,
        });
    }

    writeToCookie(res, key, value, expireDay) {
        res.cookie(key, value, {
            httpOnly: true,
            secure: true,
            maxAge: Number(expireDay) * 24 * 60 * 60 * 1000,
        });
    }

    verifyToken(token, secretKey) {
        return jwt.verify(token, secretKey);
    }
}

export default new Token();