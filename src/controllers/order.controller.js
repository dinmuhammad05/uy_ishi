import { BaseController } from "./base.controller.js";
import Order from "../models/order.model.js";
import Client from "../models/client.model.js";
import Course from "../models/course.model.js";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/succes-res.js";

class OrderController extends BaseController {
    constructor() {
        super(Order, [
            { path: "clientId" },
            {
                path: "courseId",
                populate: [
                    { path: "owner" }, 
                    { path: "category" }, 
                ],
            },
        ]);
    }

    async createOrder(req, res, next) {
        try {
            const { clientId, courseId } = req.body;

            const existsClient = await Client.findOne({ _id: clientId });
            if (!existsClient) {
                throw new AppError("client not found", 404);
            }

            const existsCourse = await Course.findOne({ _id: courseId });
            if (!existsCourse) {
                throw new AppError("course not found", 404);
            }

            const newOrder = await Order.create(req.body);
            return successRes(res, newOrder, 201);
        } catch (error) {
            next(error);
        }
    }

    async updateOrder(req, res, next) {
        try {
            const id = req.params?.id;
            await OrderController.checkId(Order, id);

            const { clientId, courseId } = req.body;
            if (clientId) {
                const existsClient = await Client.findOne({ _id: clientId });
                if (!existsClient) {
                    throw new AppError("client not found", 404);
                }
            }

            if (clientId) {
                const existsCourse = await Course.findOne({ _id: courseId });
                if (!existsCourse) {
                    throw new AppError("course not found", 404);
                }
            }

            const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            return successRes(res, updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const id = req.params?.id;
            await BaseController.checkId(Order, id);
            const status = req.body;
            switch (status) {
                case "canseled":
                    await Order.findByIdAndUpdate(id, { status });
                    break;

                case "completed":
                    await Order.findByIdAndUpdate(id, { status });
                    break;
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();
