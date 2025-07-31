import { Router } from "express";

import controller from "../controllers/client.controller.js";

const router = Router();

router
    .post("/", controller.createClient)
    .post("/token", controller.generateNewToken)
    .post("/signin", controller.signIn)
    .post("/signout", controller.signOut)

    .get("/", controller.getAll)
    .get("/:id", controller.getById)

    .patch("/forget-password", controller.forgetPassword)
    .patch("/confrim-otp", controller.confirmOTP)
    .patch("/confirm-password", controller.confirmPassword)
    .patch("/:id", controller.updateClient);

export default router;
