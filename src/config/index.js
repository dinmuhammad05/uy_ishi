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
};
