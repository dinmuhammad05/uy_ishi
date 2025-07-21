import express from "express";
import config from "./config/index.js";
import { connectDB } from "./db/index.js";
import router from "./routes/index.route.js";

const app = express();

const PORT = config.PORT;

app.use(express.json());

await connectDB();

app.use("/api", router);

app.listen(PORT, () => console.log("server running on port", PORT));
