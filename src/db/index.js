import { connect } from "mongoose";
import config from "../config/index.js";

export const connectDB = async () => {
    try {
        await connect(config.MONGO_URI);
        console.log("connected to DB");
    } catch (error) {
        console.log("error in connect to DB", error.message);
    }
};
