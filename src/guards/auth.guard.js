import config from "../config/index.js";
import token from "../utils/Token.js";
export const AuthGuard = async (req, res, next) => {
    try {
        const auth = req.headers?.authorization;
        if (!auth) {
            return res.status(401).json({
                statusCode: 401,
                message: "authorization error",
            });
        }

        const bearer = auth.split(" ")[0];
        const authToken = auth.split(" ")[1];
        if (bearer !== "Bearer" && !authToken) {
            return res.status(402).json({
                statusCode: 401,
                message: "unauthorized",
            });
        }
        
        const user = token.verifyToken(authToken, config.Token.Access_Token_Key);
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
};
