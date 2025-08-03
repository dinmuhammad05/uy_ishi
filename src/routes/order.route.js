import { Router } from "express";

import controller from "../controllers/order.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/role.guard.js";
import {validate} from '../middlewares/validate.js';
import OrderValidation from '../validation/OrderValidation.js';


const router = Router();

router
    .post("/", validate(OrderValidation.create), controller.createOrder)
    .get("/", AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), controller.getAll)
    .get("/:id", AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), controller.getById)
    .patch("/:id", validate(OrderValidation.update), AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), controller.updateOrder)
    .delete("/:id", AuthGuard, RolesGuard('superAdmin', 'admin', 'ID'), controller.delete);

export default router;
