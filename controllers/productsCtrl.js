import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import { raw } from "express";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";
import upload from "../config/fileUpload.js";


//@desc Create new product
//@route POST /api/v1/products
//@access Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {

  const convertedImgs = req.files.map((file) => file.path);

    const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;
    //product exists
    const productExists = await Product.findOne({name});
    if(productExists) {
        throw new Error("Product already Exists");
    }
    //find the brand
  const brandFound = await Brand.findOne({
    name: brand?.toLowerCase(),
  });
  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand name"
    );
  }
  //find the category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
  }
    //create the product
    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
        images: convertedImgs,

      });
  //push the product into category
  categoryFound.products.push(product._id);
  //resave
  await categoryFound.save();

  //push the product into brand
  brandFound.products.push(product._id);
  //resave
  await brandFound.save();

    //send response
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
      });
});

//@desc Get all product
//@route POST /api/v1/products
//@access Public

export const getProductsCtrl = asyncHandler(async(req, res)=>{
  console.log(req.query);
  //query
  let productQuery = Product.find();
  

  //search by name 
  if(req.query.name){
    productQuery = productQuery.find({
      name:{ $regex: req.query.name, $options:'i'},
    });
  }

  
  if(req.query.brand){
    productQuery = productQuery.find({
      brand:{ $regex: req.query.brand, $options:'i'},
    });
  }

  if(req.query.category){
    productQuery = productQuery.find({
      category:{ $regex: req.query.category, $options:'i'},
    });
  }

  
  if(req.query.colors){
    productQuery = productQuery.find({
      colors:{ $regex: req.query.colors, $options:'i'},
    });
  }

  if(req.query.sizes){
    productQuery = productQuery.find({
      sizes:{ $regex: req.query.sizes, $options:'i'},
    });
  }
  //filter by price range
  if(req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //gte: less than or equal to
    productQuery = productQuery.find({
      price:{$gte: priceRange[0], $lte: priceRange[1] }
    });
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIndx
  const startIndex = (page -1) * limit;
  //end Index
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);
  //pagination results
  const pagination = {}
  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate('reviews');

  res.json({
    status: "success",
    total,
    result: products.length,
    pagination,
    message: 'product fetched successfully',
    products,
  });
});

//@desc Get single product
//@route POST /api/products/:id
//@access Public

export const getProductCtrl = asyncHandler(async(req, res)=>{

  const product = await Product.findById(req.params.id).populate('reviews');
  if(!product){
    throw new Error('Product not found')
  }
  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

//@desc Get single product
//@route POST /api/products/:id/update
//@access Private/Admin
export const updateProductCtrl = asyncHandler(async(req, res)=>{
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;

    //update
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name, description, category, sizes, colors, price, totalQty, brand
    },{
      new: true,
    });
  
  res.json({
    status: "success",
    message: "Product update successfully",
    product,
  });
});

//@desc Get single product
//@route DELETE /api/products/:id/delete
//@access Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});