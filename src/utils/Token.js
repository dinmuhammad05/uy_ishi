import jwt from "jsonwebtoken";
import config from "../config/index.js";

class Token {
    generateAccessToken(playload) {
        return jwt.sign(playload, config.Token.Access_Token_Key, {
            expiresIn: config.Token.Access_Token_Time,
        });
    }

    generateRefreshToken(playload) {
        return jwt.sign(playload, config.Token.Refresh_Token_Key, {
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