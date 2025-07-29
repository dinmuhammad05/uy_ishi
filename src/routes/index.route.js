import { Router } from 'express'
import AdminRoter from './admin.route.js'
import OwnerRouter from './owner-routes.route.js'
import { pageError } from '../error/page-not-found-error.js';

const router = Router()

router
    .use('/admin', AdminRoter)
    .use('/owner', OwnerRouter)
    .use(pageError)

export default router;