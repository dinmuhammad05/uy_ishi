import { isValidObjectId } from "mongoose";

export class BaseController {

    constructor(model) {
        this.model = model
    }

    create = async (req, res) => {
        try {
            const data = await this.model.create(req.body);
            return res.status(201).json({
                statusCode: 201,
                message: "success",
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }

    getAll = async (_, res) => {
        try {
            const data = await this.model.find();
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }

    getById = async (req, res) => {
        try {
            const id = req.params?.id
            await this.checkId(id, res)
            const data = await this.model.findById(id);
            if (!data) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                })
            }

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }

    update = async (req, res) => {
        try {
            const id = req.params.id
            await this.checkId(id, res);
            const data = await this.model.findByIdAndUpdate(id, req.body, {new:true})

            if (!data) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                })
            }
            
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }

    delete = async (req, res) => {
        try {
            const id = req.params.id
            await this.checkId(id, res);
            const data = await this.model.findByIdAndDelete(id)

            if (!data) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                })
            }
            
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data:{}
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }

    checkId = async (id, res) => {
        try {
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid Object Id"
                })
            }
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'interval server error'
            })
        }
    }
}

// export default new BaseController();