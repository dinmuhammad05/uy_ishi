import { Router } from "express";

import controller from "../controllers/course.controller.js";
import { RolesGuard } from "../guards/role.guard.js";
import { uploadFile } from "../middlewares/fileUpload.js";
import { AuthGuard } from "../guards/auth.guard.js";
import {validate} from '../middlewares/validate.js';
import CourseValidate from '../validation/CourseValidation.js';

const router = Router();

router
	.post("/", AuthGuard, RolesGuard('superAdmin', 'ID'), validate(CourseValidate.create), uploadFile.single("file"), controller.createCourse)

	.get("/",AuthGuard, RolesGuard("superAdmin", "ID"), controller.getAll)
	.get("/:id",AuthGuard, RolesGuard("superAdmin", "ID"), controller.getById)

	.patch("/:id",AuthGuard, RolesGuard("superAdmin", "ID"), validate(CourseValidate.create), controller.update)

	.delete("/:id",AuthGuard, RolesGuard("superAdmin", "ID"), controller.delete);

export default router;
