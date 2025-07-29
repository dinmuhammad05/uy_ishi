import { AppError } from "../error/AppError.js";

export const validate = (schemaValid) => {
  return function (req, res, next) {
    try {
      const schema = schemaValid();
        // console.log(schemaValid);
        
      const { error } = schema.validate(req.body);

      if (error) {
        throw new AppError(error?.details[0]?.message, 422);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
