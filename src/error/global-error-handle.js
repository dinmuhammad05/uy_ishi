export const globalErrorHandle = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server error";

    return res.status(statusCode).json({
        statusCode,
        message,
    });
};
