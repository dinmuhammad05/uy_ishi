import controller from '../controllers/order.controller.js'
import { Router } from 'express'

const router = Router()

router
	.post('/', controller.create)
	.get('/', controller.getAll)
	.get('/:id', controller.getById)
	.patch('/:id', controller.update)
	.delete('/:id', controller.delete)

export default router;