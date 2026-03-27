class ApiError extends Error {
    constructor(statuCode, message) {
        super(message);
        this.statuCode = statuCode;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;