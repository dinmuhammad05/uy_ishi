import { config } from "dotenv";

config();

export default {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SuperAdminUserName:process.env.userName,
    SuperAdminEmail:process.env.email,
    SupeAdminPassword:process.env.hashedPassword
};
