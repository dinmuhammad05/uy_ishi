import Joi from "joi";

class CategoryValidation {
    create() {
        return Joi.object({
            name: Joi.string().min(2).required(),
        });
    }

    update() {
        return Joi.object({
            name: Joi.string().min(2).optional(),
        });
    }
}

export default new CategoryValidation();
