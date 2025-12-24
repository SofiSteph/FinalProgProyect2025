class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith("4")? "fail" : "error";
        this.isOperational = true; //marca el error como operativo

        Error.captureStackTrace(this, this.constructor); //captura la pila de llamadas
    }
}

module.exports = AppError;