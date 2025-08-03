import Joi from "joi";

class VideosValidation {
    create() {
        return Joi.object({
            title: Joi.string().required(),
            courseId: Joi.string().length(24).hex().required(),
        });
    }

    update() {
        return Joi.object({
            title: Joi.string().required(),
            courseId: Joi.string().length(24).hex().required(),
        });
    }
}
export default new VideosValidation();
