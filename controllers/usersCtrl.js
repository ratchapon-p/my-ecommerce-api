import User from "../model/User.js";
import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

//@desc  Register user
//@route Post /api/v1/users/register
//@access Private/Admin

export const registerUserCtrl = AsyncHandler(async(req, res) => {
    const { fullname, email, password } = req.body;
    //check user exists
    const userExists = await User.findOne({email});
    if (userExists) {
        throw new Error("User already exists");
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //create the user
    const user = await User.create({
        fullname, 
        email, 
        password: hashedPassword,
    });
    res.status(201).json({
        status: 'success',
        message: 'User Register Successfully',
        data: user,
    });
});

//@desc Login user
//@route POST /api/v1/users/login
//@access Publ ic

export const loginUserCtrl = AsyncHandler(async(req, res) => {
    const {email, password} = req.body;
    //find user in db

    const userFound = await User.findOne({
        email,
    });
    if(userFound && await bcrypt.compare(password, userFound && userFound?.password)){
        res.json({
            status:'success',
            message: 'User login successfully',
            userFound,
            token: generateToken(userFound?._id),
        });
    }else{
        throw new Error('invalid login credentails');
    }
});

//@desc Get user profile
//@route POST /api/v1/users/profile
//@access Private

export const getUserProfileCtrl = AsyncHandler(async(req, res)=>{
//find the user
const user = await User.findById(req.userAuthId).populate('orders');
console.log(user);
res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
});
});

//@desc update shipping address
//@route POST /api/v1/users/update/shipping
//@access Private

export const updateShippingAddressctrl = AsyncHandler(async(req, res)=>{
    const {firstName, lastName, address, city, postalCode, province, phone} = req.body;
    const user = await User.findByIdAndUpdate(req.userAuthId, {
        shippingAddress:{
            firstName, lastName, address, city, postalCode, province, phone
        },
        hasShippingAddress: true,
    },
    {new: true,}
    );
    res.json({
        status: "success",
        msg:'Address update successfully',
        user,
    });
});