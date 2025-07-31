import { Router } from "express";

import controller from "../controllers/course-videos.controller.js";

const router = Router();

router
    .post("/", controller.creatVideos)

    .get("/", controller.getAll)
    .get("/:id", controller.getById)

    .patch("/:id", controller.updateVideos)

    .delete("/:id", controller.delete);

export default router;
