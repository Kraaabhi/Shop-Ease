module.exports=(theFunc)=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next);
}

//The code is defining a higher-order function that takes a function theFunc as an argument and 
//returns a new function that takes the parameters req, res, and next.


// If theFunc throws an error or returns a rejected Promise,
//  the error will be caught by the catch block and passed on to the next middleware
//   function in the Express.js pipeline using the next function.

