import Order from "../model/Order.js";
import Stripe from "stripe";
import AsyncHandler from "express-async-handler";
import User from "../model/User.js";
import Product from "../model/Product.js";
import dotenv from "dotenv";
import Coupon from "../model/Coupon.js";
dotenv.config()

//desc create order
//@route POST /api/v1/orders
//access private

//stripe
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = AsyncHandler(async(req, res) => {
    //get the coupon
    const {coupon} = req.query;

    const couponFound = await Coupon.findOne({
         code: coupon?.toUpperCase(),
    });
    if(couponFound?.isExpired){
        throw new Error('Coupon has expired');
    }
    if(!couponFound){
        throw new Error('Coupon does exists');
    }
    
    //get discount
    const discount = couponFound?.discount / 100;

    //get the payload(customer, orderItems, shippingAddress, totalPrice)
    const { orderItems, shippingAddress, totalPrice } = req.body;
    
    //find the user
    const user = await User.findById(req.userAuthId);
    //check if user has shipping address
    if(!user?.hasShippingAddress){
        throw new Error("Please provide shipping address");
    }
    //Check if order is not empty
    if(orderItems <= 0){
        throw new Error("No Order Items");
    }
    //place/create order - save into DB
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    
    });
    console.log(order);

    //update the product qty
    const products = await Product.find({_id:{$in:orderItems}});

    orderItems?.map(async (order)=>{
        const product = products?.find((product) =>{
            return product?._id?.toString() === order?._id?.toString();
        });
        if(product){
            product.totalSold += order.qty;
        }
        await product.save();
    });
    //push order into user
    user.orders.push(order?._id);
    await user.save();


    //make payment (stripe)
    //convert order items to have structure that stripe need
    const convertedOrder = orderItems.map((item)=>{
        return{
            price_data: {
                currency: "usd",
                product_data:{
                    name: item?.name,
                    description: item?.name,
                },
                unit_amount: item?.price * 100,
            },
            quantity: item?.qty
        };
    });
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrder,
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
    mode:'payment',
    success_url:'http://localhost:3000/success',
    cancel_url:'http://localhost:3000/cancle',
    });
    res.send({url: session.url});
});

export const getAllordersCtrl = AsyncHandler(async(req, res)=>{
//find all orders
const orders = await Order.find();
res.json({
    success: true,
    message: "All orders",
    orders,
});
});

//@desc get single order
//@router GET /api/v1/orders/:id
//@access private admin'

export const getSingleOrderCtrl = AsyncHandler(async(req, res)=> {
    //get the id from params
    const id = req.params.id;
    const order = await Order.findById(id);
    //send respond
    res.status(200).json({
        success: true,
        message: "Single orders",
        order,
    });
});  

//@desc update order to delivered
//@router PUT /api/v1/orders/update/:id
//@access private admin


export const updateOrderCtrl = AsyncHandler(async(req, res)=> {
    //get the id from params
    const id = req.params.id;
    //update
    const updateOrder = await Order.findByIdAndUpdate(id, {
        status: req.body.status,
    },
    {
        new: true,
    });   


});


//@desc get sale sum of order
//@router PUT /api/v1/orders/sale/sum
//@access private admin

export const getOrderStatsCtrl = AsyncHandler(async(req, res)=>{
    //get stats
    const orders = await Order.aggregate([
        {
            $group: {
              _id: null,
              minimumSale: {
                $min: "$totalPrice"
              },
              totalSales: {
                $sum: "$totalPrice"
              },
              maxSale: {
                $max: "$totalPrice"
              },
              avgSale: {
                $avg: "$totalPrice"
              },
            },
        },
    ]);
    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()) ;
    const saleToday = await Order.aggregate([
        {
            $match: {
              createAt:{
                $gte: today,
              },
            },
        },
        {
            $group:{
                _id: null,
                totalSales:{
                    $sum: "$totalPrice",
                },
            },
        },
    ]);
    //send respond
res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
});
});


