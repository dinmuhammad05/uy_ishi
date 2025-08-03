import Joi from "joi";

class CourseValidation {
    create() {
        return Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().min(0),
            owner: Joi.string().length(24).hex(),
            category: Joi.string().length(24).hex()
        });
    }

	update() {
        return Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price: Joi.number().min(0),
            owner: Joi.string().length(24).hex(),
            category: Joi.string().length(24).hex()
        });
    }
}

export default new CourseValidation();
