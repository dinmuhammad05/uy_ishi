import { BaseController } from "./base.controller.js";
import Videos from "../models/course-videos.model.js";
import Course from "../models/course.model.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/succes-res.js";
class VideosController extends BaseController {
    constructor() {
        super(Videos);
    }

    async creatVideos(req, res, next) {
        try {
            const { courseId } = req.body;
            const course = await Course.findOne({ courseId });
            if (!course) {
                throw new AppError("course not found", 404);
            }
            const newVideo = await Videos.create(req.body);
            return successRes(res, newVideo, 201);
        } catch (error) {
            next(error);
        }
    }

    async updateVideos(req, res, next) {
        try {
            const id = req.body;
            await BaseController.checkId(Videos, id);
            const { courseId } = req.body;
            const course = await Course.findOne({ courseId });
            if (!course) {
                throw new AppError("course not found", 404);
            }
            const updatedVideo = await Videos.findOneAndUpdate(id, req.body, {
                new: true,
            });
            return successRes(res, updatedVideo);
        } catch (error) {
            next(error);
        }
    }
}

export default new VideosController();
