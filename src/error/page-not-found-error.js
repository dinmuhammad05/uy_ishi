import { AppError } from "./AppError.js"

export const pageError = (_req, _res, next) =>{
throw next(new AppError('page not found', 404))
}