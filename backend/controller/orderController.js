const Product = require('../models/productModels')
const ErrorHandler = require('../utils/errorhandler')
const Order = require('../models/orderModel')
const catchAsyncError = require('../middleware/catchAsyncError')

//create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now()
});

    res.status(201).json({
        success:true,
        order
    })
})


//get single order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);
   if(!order){
    return next(new ErrorHandler(`order not found with id:${req.params.id}`,404));
   }
   res.status(200).json({
    success:true,
    order

   })
})
//get my order
exports.getMyOrder = catchAsyncError(async(req,res,next)=>{
    const order= await Order.find({user:req.user._id});
   if(!order){
    return next(new ErrorHandler(`order not found `,404));
   }
   res.status(200).json({
    success:true,
    order

   })
})

//get all order --admin 
exports.getOrder = catchAsyncError(async(req,res,next)=>{
    const order= await Order.find();
    let totalAmount=0;
    order.forEach((order)=>{
        totalAmount+=order.totalPrice
    })
  
   res.status(200).json({
    success:true,
    totalAmount,
    order
   })
})

exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`order not found with this id`,400));
    }
   if(order.orderStatus==="delivered"){
    return next(new ErrorHandler(`this order has already delivered to you`,400));
   }

    order.orderItems.forEach(async( order)=>{
     await updateStock(order.product,order.quantity);
   })
   order.orderStatus=req.body.status;
   if(order.orderStatus==="delivered"){
    order.deliveredAt=Date.now()
   }
   await order.save({validateBeforeSave:false});
   res.status(200).json({
    success:true,
   
   })
})

exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`order not found with this id`,400));
    }
    await order.remove();
   res.status(200).json({
    success:true,
   
   })
})

async function updateStock(id,quantity){
   const  product=Product.findById(id); 
   product.Stock-=quantity;
   await product.save({validateBeforeSave:false});
}

