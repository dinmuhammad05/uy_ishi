import Joi from "joi";

class OwnerValidation{
    static passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    create(){
        return Joi.object({
            email:Joi.string().email().required(),
            username:Joi.string().required(),
            password:Joi.string().pattern(OwnerValidation.passRegex).required(),
            fullName:Joi.string().required(),
            experience:Joi.string().optional()
        })
    }

    signin(){
        return Joi.object({
            username:Joi.string().required(),
            password:Joi.string().pattern(OwnerValidation.passRegex).required(),
        })
    }

    update(){
        return Joi.object({
            email:Joi.string().email().optional(),
            username:Joi.string().optional(),
            password:Joi.string().pattern(OwnerValidation.passRegex).optional(),
            fullName:Joi.string().optional(),
            experience:Joi.string().optional()
        })
    }
}

export default new OwnerValidation();