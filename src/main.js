import express from "express";
import config from "./config/index.js";

const app = express();

const PORT = config.PORT;

app.listen(PORT, () => console.log("server running on port", PORT));
