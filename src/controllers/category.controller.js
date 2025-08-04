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
                image: req?.file?.filename,
            });

            return successRes(res, newCategory, 201);
        } catch (err) {
            // ❗ Fpathaylni Sync tarzda o‘chirish (bloklovchi)
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

export default new CategoryController();
