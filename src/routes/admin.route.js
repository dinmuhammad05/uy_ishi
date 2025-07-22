import { Router } from "express";
import controller from '../controllers/admin.controller.js'

const router = Router();

router
    .post('/', controller.creatAdmin)
    .post('/signin', controller.signIn)
    .post('/token', controller.generateNewToken)
    .post('/signout', controller.signOut)
    .get('/', controller.getAll)
    .get('/:id', controller.getById)
    .patch('/:id', controller.update)
    .delete('/:id', controller.delete)

export default router;