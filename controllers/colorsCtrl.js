import AsyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
import Color from "../model/Color.js";

//@desc Create new Color
//@route POST /api/v1/colors
//@access Private/Admin

export const createColorCtrl = AsyncHandler(async(req, res) => {
    const {name} = req.body;
    //Brand exists
    const colorFound = await Color.findOne({name});
    if (colorFound){
        throw new Error("Color is already exists");
    }
    //create
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });
    res.json({
        status: "success",
        message: "Color create successfully",
        color,
      });

});

//@desc Get all colors
//@route Get /api/colors
//@access Public

export const getAllColorsCtrl = AsyncHandler(async(req, res) => {
    const colors = await Color.find();
    res.json({
        status: "success",
        message: "colors fetched successfully",
        colors,
      });

});

//@desc Get single colors
//@route Get /api/colors/:id
//@access Public

export const getSingleColorCtrl = AsyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  res.json({
    status: "success",
    message: "color fetched successfully",
    color,
  });
});

// @desc    Update color
// @route   PUT /api/colors/:id
// @access  Private/Admin
export const updateColorCtrl = AsyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "color updated successfully",
    color,
  });
});

//@desc Delete colors
//@route DELETE /api/colors/:id/delete
//@access Private/Admin

export const deleteColorCtrl = AsyncHandler(async(req, res)=>{

    await Color.findByIdAndDelete(req.params.id);
   
    res.json({
      status: "success",
      message: "Color delete successfully",
    });
  });

  