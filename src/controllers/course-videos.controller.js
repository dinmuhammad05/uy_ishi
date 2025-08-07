import fs, { existsSync, unlinkSync } from "fs";

import { BaseController } from "./base.controller.js";
import Videos from "../models/course-videos.model.js";
import Course from "../models/course.model.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/succes-res.js";
import { join } from "path";
class VideosController extends BaseController {
    constructor() {
        super(Videos, [
            {
                path: "courseId",
                populate: [{ path: "owner" }, { path: "category" }],
            },
        ]);
    }

    async creatVideos(req, res, next) {
        try {
            const { courseId } = req.body;
            const course = await Course.findById(courseId);

            if (!course) {
                throw new AppError("course not found", 404);
            }

            const videoUrl= `/uploads/course-videos/${req.file?.filename}`
            const newVideo = await Videos.create({
                ...req.body,
                videoUrl,
            });
            return successRes(res, {}, 201);
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

    async updateVideos(req, res, next) {
        const id = req.params.id;

        try {
            // 1. Videoni topish
            const video = await BaseController.checkId(Videos, id);

            const { courseId } = req.body;

            // 2. courseId bo'lsa, mavjudligini tekshirish
            if (courseId) {
                const course = await Course.findOne({ courseId });
                if (!course) throw new AppError("Course not found", 404);
            }

            // 3. Video faylni yangilash (agar yuklangan bo‘lsa)
            let videoUrl = video.videoUrl;

            if (req.file?.filename) {
                const oldFilename = video.videoUrl?.split("/").pop();
                const oldPath = join(
                    process.cwd(),
                    "../uploads/course-videos",
                    oldFilename
                );

                // Eski faylni o‘chirish
                if (existsSync(oldPath)) {
                    unlinkSync(oldPath);
                }

                videoUrl = `/uploads/course-videos/${req.file.filename}`;
            }

            // 4. Videoni yangilash
            const updatedVideo = await Videos.findByIdAndUpdate(
                id,
                { ...req.body, videoUrl },
                { new: true }
            );

            return successRes(res, updatedVideo);
        } catch (err) {
            // ⚠️ Xatolik bo'lsa va fayl yuklangan bo‘lsa, uni o‘chirib yuborish
            if (req.file?.path) {
                try {
                    unlinkSync(req.file.path);
                    console.log("Yangi yuklangan fayl o'chirildi");
                } catch (unlinkErr) {
                    console.error(
                        "Yuklangan faylni o'chirishda xato:",
                        unlinkErr.message
                    );
                }
            }

            next(err);
        }
    }
}

export default new VideosController();
