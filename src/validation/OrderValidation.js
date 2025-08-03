import Joi from "joi";

class OrderValidation {
    create() {
        return Joi.object({
            clientId: Joi.string().length(24).hex().required(),
            courseId: Joi.string().length(24).hex().required(),
        });
    }

    update() {
        return Joi.object({
            clientId: Joi.string().length(24).hex().required(),
            courseId: Joi.string().length(24).hex().required(),
        });
    }
}

export default new OrderValidation();
