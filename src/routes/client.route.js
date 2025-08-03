import { Router } from "express";

import controller from "../controllers/client.controller.js";
import {validate} from '../middlewares/validate.js';
import ClientValidation from '../validation/ClientValidation.js';
import { uploadFile } from '../middlewares/fileUpload.js'
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/role.guard.js';

const router = Router();

router
    .post("/", validate(ClientValidation.create), uploadFile.single('file'), controller.createClient)
    .post("/token", controller.generateNewToken)
    .post("/signin", validate(ClientValidation.signin), controller.signIn)
    .post("/signout", validate(ClientValidation.signout), controller.signOut)

    .get("/", AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'),  controller.getAll)
    .get("/:id", RolesGuard('superAdmin', 'admin', 'ID'), controller.getById)

    .patch("/forget-password", validate(ClientValidation.forgetPassword), controller.forgetPassword)
    .patch("/confrim-otp", validate(ClientValidation.confirmOTP), controller.confirmOTP)
    .patch("/confirm-password", validate(ClientValidation.confirmPassword), controller.confirmPassword)
    .patch("/:id", RolesGuard('superAdmin', 'admin', 'ID'), validate(ClientValidation.update), controller.updateClient);

export default router;
