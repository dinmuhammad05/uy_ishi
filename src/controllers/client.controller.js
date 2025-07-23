import Client from "../models/client.model.js";
import { BaseController } from "./base.controller.js";

class CkientController extends BaseController{
    constructor(){
        super(Client)
    }

    async createClient(req, res){
        try {
            
        } catch (error) {
            return res.status(500).json({
                statusCode:500,
                message:error.message || "interval server error"
            })
        }
    }
}