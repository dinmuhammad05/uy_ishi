import adminModel from "../models/admin.model.js";
import {BaseController} from "./base.controller.js";
import crypto from "../utils/Crypto.js";

class AdminController extends BaseController {
    constructor() {
        super(adminModel);
    }

    async creatAdmin(req, res) {
        try {
            const { userName, email, password } = req.body;
            const existsUserName = await adminModel.findOne({ userName });
            
            if (existsUserName) {
                return res.status(409).json({
                    statusCode: 409,
                    message: "user name already exists",
                });
            }
            
            const existsEmail = await adminModel.findOne({ email });
            if (existsEmail) {
                return res.status(409).json({
                    statusCode: 409,
                    message: "email already exists",
                });
            }
            const hashedPassword = await crypto.encrypt(password);

            const newAdmin = await adminModel.create({
                userName,
                email,
                hashedPassword
            });
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: newAdmin,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }

    async signIn(req, res) {
        try {
            const { userName, password } = req.body
            const admin = await adminModel.findOne({userName})
            const isMatchPassword = await crypto.decrypt(password, admin?.hashedPassword ?? '')
            if (!isMatchPassword) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Username or password incorrect'
                });
            }

            return res.status(200).json({
                statusCode:200,
                message:"success",
                data:admin
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }
}

export default new AdminController();