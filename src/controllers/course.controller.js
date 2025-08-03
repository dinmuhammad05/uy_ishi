import { BaseController } from "./base.controller.js";
import Course from "../models/course.model.js";
import { successRes } from "../utils/succes-res.js";

class CourseController extends BaseController {
    constructor() {
        super(Course, [
            { path: "owner" },
            { path: "category" },
            { path: "coursevideos" },
            {
                path: "orders",
                populate: { path: "clientId" },
            },
        ]);
    }

    async createCourse(req, res, next) {
        try {
            const newCourse = await Course.create({
                ...req.body,
                image: req?.file?.filename || "",
            });

            return successRes(res, newCourse, 201);
        } catch (error) {
            next(error);
        }
    }
}

export default new CourseController();
