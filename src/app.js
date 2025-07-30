import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { join } from "path";
import helmet from "helmet";
import expressWinston from "express-winston";

import { connectDB } from "./db/index.js";
import router from "./routes/index.route.js";
import { globalErrorHandle } from "./error/global-error-handle.js";
import logger from "./helpers/log/logger.js";

export const application = async (app) => {
    app.use(
        cors({
            origin: "*",
        })
    );

    app.use(helmet());

    app.use(express.json());

    app.use(cookieParser());

    await connectDB();

    app.use("/uploads", express.static(join(process.cwd(), "../uploads")));

    app.use("/api", router);

    
    // app.use(
    //     expressWinston.errorLogger({
    //         winstonInstance: logger,
    //     })
    // );
    app.use(globalErrorHandle);
};
