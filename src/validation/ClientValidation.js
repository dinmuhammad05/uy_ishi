import Joi from "joi";

class ClientValidation {
    static phonePassrejex = /^(?:\+998|998|8)(9[0-9]{8})$/;
    static passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    create() {
        return Joi.object({
            email: Joi.string().email().required(),
            phoneNumber: Joi.string()
                .required()
                .pattern(ClientValidation.phonePassrejex),
            fullName: Joi.string().required(),
            password: Joi.string()
                .pattern(ClientValidation.passRegex)
                .required(),
        });
    }

    update() {
        return Joi.object({
            email: Joi.string().email().optional(),
            phoneNumber: Joi.string()
                .optional()
                .pattern(ClientValidation.phonePassrejex),
            fullName: Joi.string().optional(),
            password: Joi.string()
                .pattern(ClientValidation.passRegex)
                .optional(),
        });
    }

    forgetPassword() {
        return Joi.object({
            email: Joi.string().email().required(),
        });
    }

    signin() {
        return Joi.object({
            email: Joi.string().required(),
            password: Joi.string()
                .pattern(OwnerValidation.passRegex)
                .required(),
        });
    }

    signout() {
        return Joi.object({
            email: Joi.string().required(),
            password: Joi.string()
                .pattern(OwnerValidation.passRegex)
                .required(),
        });
    }

    confirmOTP() {
        return Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.string().length(6).required(),
        });
    }

    confirmPassword() {
        return Joi.object({
            email: Joi.string().email().required(),
            newPassword: Joi.string()
                .pattern(OwnerValidation.passRegex)
                .required(),
        });
    }
}

export default new ClientValidation();
