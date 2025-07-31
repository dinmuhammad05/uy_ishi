import { AppError } from "./AppError.js";

export const pageError = (req, _res, next) => {
    const errorMessage =
        req.url.split("/")[1] === "uploads" ? "file not found" : "Page not found";
    throw next(new AppError(errorMessage, 404));
};
