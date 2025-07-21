import { Router } from 'express'
import AdminRoter from './admin.route.js'

const router = Router()

router
    .use('/admin', AdminRoter)

export default router;