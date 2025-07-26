import Joi from "joi";

class AdminValidator {
    static passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    create() {
        return Joi.object({
            userName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(AdminValidator.passRegex).required(),
        });
    }

    signin() {
        return Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().required(),
        });
    }

    update() {
        return Joi.object({
            usernName: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().pattern(AdminValidator.passRegex).optional(),
        });
    }
    password() {
        return Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().pattern(AdminValidator.passRegex).required()
        })
    }
}

export default new AdminValidator();
