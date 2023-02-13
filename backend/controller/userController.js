const ErrorHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilePicUrl",
    },
  });
  const token = user.getJWTToken();
  sendToken(user, 201, res);
});

// login user

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("please enter email & password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or password"));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email of password", 401));
  }
  const token = user.getJWTToken();

  sendToken(user, 200, res);
});

// logout user
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//get user detail
exports.getUserDetails=catchAsyncError(async(req,res,next)=>{
    console.log("user",req.user);
    const user =await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })

})
exports.updatePassword=catchAsyncError(async(req,res,next)=>{
    console.log("user",req.user);
    const user =await User.findById(req.user.id).select("+password");
    const isPasswordMatched= await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("old password is incorrect",400));
    }
    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400));
    }
    user.password=req.body.newPassword

    await user.save();
    sendToken(user,200,res);
  

})
exports.updateProfile=catchAsyncError(async(req,res,next)=>{
    console.log("user",req.user);
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
   res.status(200).json({
    succes:true,
    user
   })  

})

exports.getAllUsers=catchAsyncError(async(req,res,next)=>{
  const user=await User.find();
  res.status(200).json({
    success:true,
    user
  })

})
// only for admin
exports.getSingleUserDetail=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,404))
    }
    res.status(200).json({
      success:true,
      user
    })
  
  })
// for admin
  exports.updateUser=catchAsyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
   res.status(200).json({
    succes:true,
    user
   })  

})

//-- Admin
exports.deleteUser=catchAsyncError(async(req,res,next)=>{
    
    const user=await User.findById(req.params.id)
    if(!user){
        return next( new ErrorHandler(`user does not exixt with id :${req.params.id}`,404))
    }
    await user.remove();
   res.status(200).json({
    succes:true,
    message:"user deleted successfully"
   })  
})
