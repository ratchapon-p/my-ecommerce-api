import AsyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";


//@desc Create new brand
//@route POST /api/v1/categories
//@access Private/Admin

export const createBrandCtrl = AsyncHandler(async(req, res) => {
    const {name} = req.body;
    //Brand exists
    const brandFound = await Brand.findOne({name});
    if (brandFound){
        throw new Error("Brand is already exists");
    }
    //create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status: "success",
        message: "Brand create successfully",
        brand,
      });

});

//@desc Get all brands
//@route Get /api/brands
//@access Public

export const getAllBrandsCtrl = AsyncHandler(async(req, res) => {
    const brands = await Brand.find();
    res.json({
        status: "success",
        message: "Brands fetched successfully",
        brands,
      });

});

//@desc Get single brands
//@route Get /api/brandsssssssssssss/:id
//@access Public

export const getSingleBrandsCtrl = AsyncHandler(async(req, res) => {
    const brand = await Brand.findById(req.params.id);
    res.json({
        status: "success",
        message: "brand fetched successfully",
        brand,
      });

});

//@desc Update Brand
//@route PUT /api/Brands/:id/update
//@access Private/Admin

export const updateCBrandCtrl = AsyncHandler(async(req, res)=>{
    const { name } =
      req.body;
  
      //update
      const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name,
      },
      {
        new: true,
      });
    
    res.json({
      status: "success",
      message: "brand update successfully",
      brand,
    });
  });

//@desc Delete brand
//@route DELETE /api/brands/:id/delete
//@access Private/Admin

export const deleteBrandCtrl = AsyncHandler(async(req, res)=>{

    await Brand.findByIdAndDelete(req.params.id);
   
    res.json({
      status: "success",
      message: "Brand delete successfully",
    });
  });