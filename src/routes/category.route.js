import { Router } from "express";

import controller from "../controllers/category.controller.js";
import { RolesGuard } from "../guards/role.guard.js";
import { uploadFile } from "../middlewares/fileUpload.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { validate } from "../middlewares/validate.js";
import categoryValidation from '../validation/category.validate.js'

const router = Router();

router
    .post("/",AuthGuard, RolesGuard('superAdmin', 'admin'), validate(categoryValidation.create), uploadFile.single("file"), controller.createCategory)

    .get("/",AuthGuard, RolesGuard("superAdmin", "admin"), controller.getAll)
    .get("/:id",AuthGuard, RolesGuard("superAdmin", 'admin'), controller.getById)

    .patch("/:id",AuthGuard, RolesGuard("superAdmin", 'admin'), uploadFile.single('file'), validate(categoryValidation.update), controller.updateCategory)

    .delete("/:id",AuthGuard, RolesGuard("superAdmin", ), controller.delete);

export default router;
