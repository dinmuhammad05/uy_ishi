import { Router } from "express";
import controller from '../controllers/admin.controller.js'
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/role.guard.js";
import { validate } from "../middlewares/validate.js";
import AdminValidation from "../validation/AdminValidation.js";
import { requestLimit } from "../utils/request-limit.js";


const router = Router();

router
    .post('/', AuthGuard, RolesGuard("superAdmin"), validate(AdminValidation.create), controller.creatAdmin)
    .post('/signin', requestLimit(60, 10), validate(AdminValidation.signin), controller.signIn)
    .post('/token', controller.generateNewToken)
    .post('/signout', AuthGuard, controller.signOut)

    .get('/', AuthGuard, RolesGuard('superAdmin'), controller.getAll)
    .get('/:id', AuthGuard, RolesGuard('superAdmin', 'ID'), controller.getById)

    .patch('/password/:id', AuthGuard, RolesGuard('superAdmin', 'id'), validate(AdminValidation.password), controller.updatePasswordforAdmin)
    .patch('/forget-password', validate(AdminValidation.forgetPassword), controller.forgetPassword)
    .patch('/confirm-otp', validate(AdminValidation.confirmOTP), controller.confirmOTP)
    .patch('/confirm-password', validate(AdminValidation.confirmPassword), controller.confirmPassword)
    .patch('/:id', AuthGuard, RolesGuard('superAdmin', 'ID'), controller.update)

    .delete('/:id', AuthGuard, RolesGuard('superAdmin'), controller.delete)


export default router;