import Category from "../models/category.model.js";
import { successRes } from "../utils/succes-res.js";
import { BaseController } from "./base.controller.js";

class CategoryController extends BaseController {
    constructor() {
        super(Category, ['Course']);
    }

    async createCategory(req, res, next) {
        try {
            const newCategory = await Category.create({
                ...req.body,
                image: req.body?.file?.filename,
            });

            return successRes(res, newCategory, 201);
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();
