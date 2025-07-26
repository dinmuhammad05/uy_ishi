import { ipKeyGenerator, rateLimit } from 'express-rate-limit'

export const requestLimit = (seconds, limit) => {
    const limiter = rateLimit({
        windowMs: seconds * 1000,
        limit,
        keyGenerator: (req, _) => {
            return ipKeyGenerator(req.ip) || (req.body.phoneNumber ?? req.body.username)
        },
        message:{
            status:429,
            message:'To many requests'
        },
        legacyHeaders:true,
        standardHeaders:'draft-6' || 'draft-7' || 'draft-8'
    })
    return limiter
}