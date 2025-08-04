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
                image: req?.file?.path || "",
            });

            return successRes(res, newCourse, 201);
        } catch (err) {
            // ❗ Faylni Sync tarzda o‘chirish (bloklovchi)
            if (req.file?.path) {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log("Fayl o'chirildi");
                } catch (unlinkErr) {
                    console.error(
                        "Faylni o'chirishda xato:",
                        unlinkErr.message
                    );
                }
            }

            next(err);
        }
    }
}

export default new CourseController();
