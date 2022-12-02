const jwt = require("jsonwebtoken");
const createError = require("http-errors")

const auth = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return async (req, res, next) => {
        if (!req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            return next(createError(403, 'Authorization token is required'))
        }
        const token = req.headers.authorization.replace("Bearer ", "");
        try {
            const isvarified = await jwt.verify(token, process.env.TOKENSECRATE);
            if (!isvarified) {
                return next(createError(403, "Invalid Token"))
            }
            if (roles.length > 0) {
                if (roles.includes(isvarified.role)) {
                    req.user_id = isvarified.id
                    req.role = isvarified.role
                    next()
                } else {
                    return next(createError(403, `Only ${roles.toString()} can do this request.`))
                }
            } else {
                req.user_id = isvarified.id
                req.role = isvarified.role
                next();
            }
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = auth