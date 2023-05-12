import Coupon from "../model/Coupon.js";
import AsyncHandler from 'express-async-handler';

//@desc Create new coupon
//@route POST /api/v1/coupons 
//@access private/admin

export const createCouponCtrl = AsyncHandler(async(req, res)=>{
    const {code, startDate, endDate, discount} = req.body
    //check if admin
    //check if coupn already exists
    const couponExists = await Coupon.findOne({
        code,
    });
    if(couponExists){
        throw new Error("Coupon already exists");
    }
    //check discount is a number
    if(isNaN(discount)){
        throw new Error("Discount number must be a number");
    }
    //create couypon
    const coupon = await Coupon.create({
        code: code?.toUpperCase()
        , startDate, endDate, discount, user: req.userAuthId,
    }
    );
    //send the respond
    res.status(201).json({
        status: "success",
        message: "Coupon Create Successfully",
        coupon
    }
    );
});

//@desc Get all coupon
//@route POST /api/v1/coupons 
//@access private/admin

export const getAllCouponsCtrl = AsyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.status(200).json({
      status: "success",
      message: "All coupons",
      coupons,
    });
  });

//@desc Get single coupon
//@route POST /api/v1/coupons/:id
//@access private/admin

export const getCouponCtrl= AsyncHandler(async(req, res)=>{
    const coupon = await Coupon.findById(req.params.id);
    res.json({
        status: "success",
        message: "Coupon fetched",
        coupon,
    });
});

export const updateCouponCtrl= AsyncHandler(async(req, res)=>{
    const {code, startDate, endDate, discount} = req.body
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase,
        discount, startDate, endDate
    },{
        new: true
    });
    res.json({
        status: "success",
        message: "Coupon Updated successfully",
        coupon,
    })
});

export const deleteCouponCtrl= AsyncHandler(async(req, res)=>{
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Coupon Updated successfully",
        coupon,
    });
});
