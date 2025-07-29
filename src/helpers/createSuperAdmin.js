import { disconnect } from "mongoose";
import config from "../config/index.js";
import { connectDB } from "../db/index.js";
import Admin from "../models/admin.model.js";
import crypto from "../utils/Crypto.js";

(async function () {
    try {
        await connectDB();
        const hashedPassword = await crypto.encrypt(config.Admin.SuperAdminPassword);
        await Admin.create({
            userName: config.Admin.SuperAdminUserName,
            email: config.Admin.SuperAdminEmail,
            hashedPassword,
            role: "superAdmin",
        });
        console.log("super admin success created");
        await disconnect();
    } catch (error) {
        console.log("error in creating super Admin", error.message);
    }
})();
