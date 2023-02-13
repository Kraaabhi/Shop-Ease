const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

//create product  -- admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id; //adding user.id to body
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product: product,
  });
});

//get all product
exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  const productCount = await Product.countDocuments();
  const apifeature = new ApiFeatures(Product, req.query)
    .search()
    .filter()
    .pagination();

  const product = await apifeature.query;
  res.status(201).json({
    success: true,
    productCount,
    product: product,
  });
});

// update product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("product not found", 404));
  }
  let product = await Product.findById(req.params.id);
  if (!product) {
    const err = new ErrorHandler("product not found", 404);
    return next(err);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(201).json({
    success: true,
    product: product,
  });
});

//  delete product;

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("product not found", 404));
  }
  let product = await Product.findById(req.params.id);
  if (!product) {
    const err = new ErrorHandler("product not found", 404);
    return next(err);
  }
  await product.remove();
  res.status(201).json({
    success: true,
    message: "product deleted successfully",
  });
});

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("product not found", 404));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    const err = new ErrorHandler("product not found", 404);
    return next(err);
  }
  res.status(201).json({
    success: true,
    product: product,
  });
});

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
 
  

  const product = await Product.findById(productId);
  const isReviewed =  product.reviews.find(
    (rev) => {
      if(String(rev.user) === String(req.user._id)){
        return true;
      }
      else {
        return false}
    }
  );  


  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (String(rev.user) === String(req.user._id)) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let sum = 0;
   product.reviews.forEach((rev) => {
      sum += rev.rating;
  }) 
  product.ratings=sum/ product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

exports.getAllReview=catchAsyncError(async(req,res,next)=>{
  const product=await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler("product not found",404));
  }
res.status(200).json({
  success:true,
  reviews: product.reviews
})
})
exports.deleteReview=catchAsyncError(async(req,res,next)=>{
  const product=await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler("product not found",404));
  }
  const reviews=product.reviews.filter(rev=>String(rev._id)!==req.query.id)

  let sum = 0;
  reviews.forEach((rev) => {
      sum += rev.rating;
  }) 
  const ratings=sum/reviews.length;
  const numOfReviews=reviews.length;
  await Product.findByIdAndUpdate(req.query.productId,{reviews,ratings,numOfReviews},{new:true,runValidators:true,useFindAndModify:false})

  res.status(200).json({
  success:true,
   })
})
