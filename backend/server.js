 const app =require("./app");
 const dotenv=require("dotenv");
 const connectDatabase= require("./config/database")
 //handling uncought exception
 process.on("uncaughtException",err=>{
   console.log(`error message:${err.message}`);
   console.log(`shutting down the server due to uncought error`);
   process.exit(1);
 })

//config
 dotenv.config({path:"backend/config/config.env"})
 const PORT= process.env.PORT

connectDatabase();


 const server=app.listen(3000,()=>{
    console.log(`server is running on: http://localhost:${PORT}`); 
 })

// unhandled promise rejection
 process.on("unhandledRejection",err=>{
   console.log(`error message:${err.message}`);
   console.log(`shutting down the server due to unhandle promise rejection`);
   // closing the server and   exiting before closing it
   server.close(()=>{
      process.exit(1);
   })
 })


