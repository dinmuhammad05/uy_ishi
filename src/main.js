import express from "express";
import config from "./config/index.js";
import { connectDB } from "./db/index.js";
import cookieParser from 'cookie-parser'
import router from "./routes/index.route.js";
import { globalErrorHandle } from "./error/global-error-handle.js";
import cors from 'cors'

const app = express();

const PORT = config.PORT;

app.use(cors({
    origin:'*'
}))

app.use(express.json());
app.use(cookieParser())

await connectDB();

app.use("/api", router);

app.use(globalErrorHandle);

app.listen(PORT, () => console.log("server running on port", PORT));
