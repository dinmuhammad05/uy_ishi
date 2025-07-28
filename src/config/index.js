import { config } from "dotenv";

config();

export default {
    PORT: process.env.PORT,

    MONGO_URI: process.env.MONGO_URI,

    Admin: {
        SuperAdminUserName: process.env.userName,
        SuperAdminEmail: process.env.email,
        SupeAdminPassword: process.env.hashedPassword
    },
    Token: {
        Access_Token_Key: String(process.env.Access_Token_Key),
        Access_Token_Time: String(process.env.Access_Token_Time),
        Refresh_Token_Key: String(process.env.Refresh_Token_Key),
        Refresh_Token_Time: String(process.env.Refresh_Token_Time),
    },
    Mail: {
        MAIL_HOST: String(process.env.MAIL_HOST),
        MAIL_PORT: String(process.env.MAIL_PORT),
        MAIL_USER: String(process.env.MAIL_USER),
        MAIL_PASS: String(process.env.MAIL_PASS)
    },
    Redis:{
        HOST:String(process.env.REDIS_HOST),
        PORT:String(process.env.REDIS_PORT),
        PASSWORD:String(process.env.REDIS_PASSWORD)
    },
    
};
