import { isValidObjectId } from "mongoose";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/succes-res.js";

import DeviceDetector from "node-device-detector";

const device = new DeviceDetector();
export class BaseController {
    constructor(model, populateFields = []) {
        this.model = model;
        this.populateFields = populateFields;
    }

    create = async (req, res, next) => {
        try {
            const data = await this.model.create(req.body);
            return successRes(res, data, 201);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (_, res, next) => {
        try {
            const fields = this.populateFields;
            let query = this.model.find();
            if (fields?.length) {
                fields.forEach((field) => query.populate(field));
            }
            const data = await query.exec();
            return successRes(res, data);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const id = req.params?.id;
            await BaseController.checkId(this.model, id);
            let query = this.model.findById(id);
            const fields = this.populateFields;
            if (fields?.length) {
                fields.forEach((field) => query.populate(field));
            }
            const data = await query.exec();
            return successRes(res, data);
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const id = req.params.id;
            await BaseController.checkId(this.model, id);
            const data = await this.model.findByIdAndUpdate(id, req.body, {
                new: true,
            });

            if (!data) {
                throw new AppError("not found", 404);
            }

            return successRes(res, data);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            await BaseController.checkId(this.model, id);
            await this.model.findByIdAndDelete(id);

            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    };

    static checkId = async (schema, id) => {

        if (!isValidObjectId(id)) {
            throw new AppError("invalid object id", 400);
        }
        const data = await schema.findById(id);
        if (!data) {
            throw new AppError("not found", 404);
        }
        return data;
    };
}
