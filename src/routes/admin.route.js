import { Router } from "express";
import controller from '../controllers/admin.controller.js'
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/role.guard.js";
import { validate } from "../middlewares/validate.js";
import AdminValidation from "../validation/AdminValidation.js";

const router = Router();

router
    .post('/', AuthGuard, RolesGuard("superAdmin"), validate(AdminValidation.create), controller.creatAdmin)
    .post('/signin',validate(AdminValidation.signin), controller.signIn)
    .post('/token', controller.generateNewToken)
    .post('/signout', AuthGuard, controller.signOut)
    .get('/', AuthGuard, RolesGuard('superAdmin'), controller.getAll)
    .get('/:id', AuthGuard, RolesGuard('superAdmin', 'ID'), controller.getById)
    .patch('/:id', AuthGuard, RolesGuard('superAdmin', 'ID'), controller.update)
    .delete('/:id', AuthGuard, RolesGuard('superAdmin'), controller.delete)
    
export default router;