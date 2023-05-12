import AsyncHandler from "express-async-handler";
import Category from "../model/Category.js";

//@desc Create new category
//@route POST /api/v1/categories
//@access Private/Admin

export const createCategoryCtrl = AsyncHandler(async(req, res) => {
    const {name} = req.body;
    //category exists
    const categoryFound = await Category.findOne({name});
    if (categoryFound){
        throw new Error("Category is already exists");
    }
    //create
    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path,
    });
    res.json({
        status: "success",
        message: "Category create successfully",
        category,
      });

});

//@desc Get all categories
//@route Get /api/categories
//@access Public

export const getAllCategoriesCtrl = AsyncHandler(async(req, res) => {
    const categories = await Category.find();
    res.json({
        status: "success",
        message: "Categories fetched successfully",
        categories,
      });

});

//@desc Get single categories
//@route Get /api/categories/:id
//@access Public

export const getSingleCategoryCtrl = AsyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id);
    res.json({
        status: "success",
        message: "Category fetched successfully",
        category,
      });

});

//@desc Update Category
//@route PUT /api/categories/:id/update
//@access Private/Admin

export const updateCategoryCtrl = AsyncHandler(async(req, res)=>{
    const { name } =
      req.body;
  
      //update
      const category = await Category.findByIdAndUpdate(req.params.id, {
        name,
      },
      {
        new: true,
      });
    
    res.json({
      status: "success",
      message: "category update successfully",
      category,
    });
  });

//@desc Delete category
//@route DELETE /api/category/:id/delete
//@access Private/Admin

export const deleteCategoryCtrl = AsyncHandler(async(req, res)=>{

    await Category.findByIdAndDelete(req.params.id);
   
    res.json({
      status: "success",
      message: "Category delete successfully",
    });
  });