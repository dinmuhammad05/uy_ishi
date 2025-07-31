import { Router } from "express";

import controller from "../controllers/category.controller.js";
import { RolesGuard } from "../guards/role.guard.js";
import { uploadFile } from "../middlewares/fileUpload.js";
import { AuthGuard } from "../guards/auth.guard.js";

const router = Router();

router
    .post("/",AuthGuard, RolesGuard('superAdmin'), uploadFile.single("file"), controller.createCategory)

    .get("/",AuthGuard, RolesGuard("superAdmin",), controller.getAll)
    .get("/:id",AuthGuard, RolesGuard("superAdmin", ), controller.getById)

    .patch("/:id",AuthGuard, RolesGuard("superAdmin"), controller.update)

    .delete("/:id",AuthGuard, RolesGuard("superAdmin",), controller.delete);

export default router;
