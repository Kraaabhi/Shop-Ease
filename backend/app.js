const express =require("express")
const app= express();
app.use(express.json());
const errorMiddleware=require("./middleware/error")

// //route imports
const product=require("./routes/productRoute");
app.use("/api/v1",product);

// middleware for errors
app.use(errorMiddleware)

module.exports =app;
