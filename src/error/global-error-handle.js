import logger from "../helpers/log/logger.js";

export const globalErrorHandle = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";

    logger.error(`${statusCode} ${message}`);

    return res.status(statusCode).json({
        statusCode,
        message,
    });
};