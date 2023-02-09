class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
       // The Error.captureStackTrace method is called to capture the stack trace for the error and attach it to the ErrorHandler instance.
       // The this.constructor argument passed to Error.captureStackTrace is used to specify the constructor for the error,
       // which is ErrorHandler in this case.
        Error.captureStackTrace(this,this.constructor)
    }
}

//The ErrorHandler class has a constructor that takes two arguments: message and statusCode.
//The message argument is used to set the error message and the statusCode argument is used to 
//set the status code that should be sent to the client in the response. The constructor calls the super method to set the error message,
// and then sets the status code on the ErrorHandler instance.

module.exports= ErrorHandler