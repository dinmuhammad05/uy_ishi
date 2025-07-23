export const RolesGuard = (...roles)=>{
    return function(req, res, next){
        try {
            console.log(req.user);
            
            if ((req.user?.role && roles.includes(req.user.role)) || 
                (roles.includes('ID') && req.user?.id === req.params.id)) {
                return next()
            }
            return res.status(403).json({
                statusCode:403,
                message:'forbidden user'
            })
        } catch (error) {
            return res.status(500).json({
                statusCode:500,
                message: error.message
            })
        }
    }
}