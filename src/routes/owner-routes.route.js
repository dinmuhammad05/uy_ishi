import { Router } from "express";
import controller from "../controllers/owner-course.controller.js";
import { validate } from '../middlewares/validate.js';
import OwnerValidation from '../validation/OwnerValidation.js';
import { RolesGuard } from '../guards/role.guard.js'
import { AuthGuard } from "../guards/auth.guard.js";
import { uploadFile } from '../middlewares/fileUpload.js'

const router = Router();

router
    .post('/',  uploadFile.single('file') ,validate(OwnerValidation.create), controller.createOwner)
    .post('/signin', validate(OwnerValidation.signin), controller.signin)
    .post('/token', controller.generateNewToken)
    .post('/signout', controller.signOut)

    .get('/', AuthGuard, RolesGuard('superAdmin','ID'), controller.getAll)
    .get('/:id', AuthGuard, RolesGuard('superAdmin', 'ID'), controller.getById)

    
    .patch('/forget-password', validate(OwnerValidation.forgetPassword), controller.forgetPassword)
    .patch('/confirm-otp', validate(OwnerValidation.confirmOTP), controller.confirmOTP)
    .patch('/confirm-password', validate(OwnerValidation.confirmPassword), controller.confirmPassword)
    .patch('/:id', AuthGuard, RolesGuard('superAdmin', 'ID'), validate(OwnerValidation.update), controller.update)

    .delete('/:id', AuthGuard, RolesGuard('superAdmin', 'ID'), controller.delete)

export default router;