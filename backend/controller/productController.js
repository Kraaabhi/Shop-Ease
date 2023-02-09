const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorhandler");
const mongoose = require("mongoose");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

//create product  -- admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  console.log("product body", req.body);
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product: product,
  });
});


//get all product
exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  const productCount=await Product.countDocuments();
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
    const err= new ErrorHandler("product not found", 404)
   return  next(err);
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
        const err= new ErrorHandler("product not found", 404)
        return next(err);
    }
    await product.remove();
    res.status(201).json({
      success: true,
      message: "product deleted successfully",
    });
  });

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  if( !mongoose.Types.ObjectId.isValid(req.params.id)){
     return next(new ErrorHandler("product not found",404));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    const err= new ErrorHandler("product not found", 404)
    return next(err);
  }
  res.status(201).json({
    success: true,
    product: product,
  });
});
