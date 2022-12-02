const createError = require('http-errors');

exports.error_handler = (err, req, res, next) => {
    const errorData = {}
    if (err.status) {
        errorData.status = err.status
    }
    if (err.message) {
        errorData.message = err.message
    }
    if (err.name === "CastError") {
        errorData.status = 403
        errorData.message = `Object id is invalid`
    }
    if (err.name === "ValidationError") {
        errorData.status = 422
        errorData.message = Object.values(err.errors).map(val => val.message).toString()
    }
    const newErrorResponse = createError(errorData.status || 500, errorData.message || "Internal server error")
    return res.status(newErrorResponse.status).json({
        success: false,
        message: newErrorResponse.message
    })
}
