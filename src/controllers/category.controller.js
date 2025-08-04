import { join } from "path";
import { unlinkSync, existsSync } from "fs";

import { AppError } from "../error/AppError.js";
import Category from "../models/category.model.js";
import { successRes } from "../utils/succes-res.js";
import { BaseController } from "./base.controller.js";

class CategoryController extends BaseController {
    constructor() {
        super(Category, [
            {
                path: "courses",
                populate: [
                    { path: "owner" },
                    { path: "category" }, // self populate (not necessary)
                    { path: "coursevideos" },
                ],
            },
        ]);
    }

    async createCategory(req, res, next) {
        try {
            if (!req.file) {
                throw new AppError("rasm yuklashda xatolik", 400);
            }

            const newCategory = await Category.create({
                ...req.body,
                image: `/uploads/images/${req.file.filename ?? ""}`,
            });

            return successRes(res, newCategory, 201);
        } catch (err) {
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

    async updateCategory(req, res, next) {
        try {
            const id = req?.params?.id;
            const category = await BaseController.checkId(Category, id);

            let image = category?.image;
            if (req?.file?.filename) {
                if (category?.image) {
                    const oldFile = category.image.split("/").pop(); // faqat agar image mavjud bo‘lsa
                    const oldPath = join(
                        process.cwd(),
                        "../uploads/images",
                        oldFile
                    );

                    if (existsSync(oldPath)) {
                        unlinkSync(oldPath);
                    }
                }

                image = `/uploads/images/${req.file.filename}`;
            }

            const updatedCategory = await Category.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    image,
                },
                { new: true }
            );
            return successRes(res, updatedCategory);
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();
