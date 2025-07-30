import express from "express";
import config from "./config/index.js";
import { application } from "./app.js";

const app = express();

const PORT = config.PORT;
await application(app)

app.listen(PORT, () => console.log("server running on port", PORT));
