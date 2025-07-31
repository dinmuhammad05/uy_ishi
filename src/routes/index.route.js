import { Router } from "express";

import AdminRoter from "./admin.route.js";
import OwnerRouter from "./owner-routes.route.js";
import CategoryRouter from "./category.route.js";
import CourseRouter from "./course.route.js";
import { pageError } from "../error/page-not-found-error.js";
import OrderRouter from "./order.route.js";
import ClientRouter from "./client.route.js";
import CourseVideosRouter from "./course-videos.route.js.route.js";

const router = Router();

router
    .use("/admin", AdminRoter)
    .use("/owner", OwnerRouter)
    .use("/category", CategoryRouter)
    .use("/course", CourseRouter)
    .use("/order", OrderRouter)
    .use("/client", ClientRouter)
    .use("/videos", CourseVideosRouter)

    .use(pageError);

export default router;
