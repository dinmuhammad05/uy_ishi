export class AppError extends Error {
    constructor(message, statusCode) {
        super(message, statusCode);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOptional = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
