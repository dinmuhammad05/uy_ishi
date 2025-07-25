import config from "../config/index.js";
import { AppError } from "../error/AppError.js";
import token from "../utils/Token.js";
export const AuthGuard = async (req, res, next) => {
    try {
        const auth = req.headers?.authorization;
        if (!auth) {
            return new AppError('authorization error', 401)
        }

        const bearer = auth.split(" ")[0];
        const authToken = auth.split(" ")[1];
        if (bearer !== "Bearer" && !authToken) {
            return new AppError('unauthorized', 401)
        }
        
        const user = token.verifyToken(authToken, config.Token.Access_Token_Key);
        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
};
