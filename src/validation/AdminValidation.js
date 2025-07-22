import Joi from "joi";

class AdminValidator {
    constructor() {
        this.passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    }

    create(data) {
        const admin = Joi.object({
            userName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(this.passRegex).required()
        });
        return admin.validate(data);
    }

    signin(data) {
        const admin = Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().required()
        });
        return admin.validate(data);
    }

    update(data) {
        const admin = Joi.object({
            usernName: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().pattern(this.passRegex).optional()
        });
        return admin.validate(data);
    }
}

export default new AdminValidator();