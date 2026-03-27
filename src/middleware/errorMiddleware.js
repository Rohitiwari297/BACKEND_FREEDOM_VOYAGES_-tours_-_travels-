const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statuCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || `Internal Server Error`
    })
}

export default globalErrorHandler;