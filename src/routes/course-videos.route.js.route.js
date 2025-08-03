import { Router } from "express";

import controller from "../controllers/course-videos.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/role.guard.js";
import {validate} from "../middlewares/validate.js";
import VideosValidation from "../validation/VideosValidation.js";

const router = Router();

router
    .post("/", validate(VideosValidation.create), controller.creatVideos)

    .get("/", AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), controller.getAll)
    .get("/:id",  AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), controller.getById)

    .patch("/:id", AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), validate(VideosValidation.update), controller.updateVideos)

    .delete("/:id", AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), controller.delete);

export default router;
