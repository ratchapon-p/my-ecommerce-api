import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserShema = new Schema({
    fullname: {
        type: String,
        requried: true,
    },
    email: {
        type: String,
        requried: true,
    },
    password: {
        type: String,
        requried: true,
    },
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order",
    },
],
    wishLists:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"WishLists",
    },
],

    isAdmin:{
        type: Boolean,
        default: false,
    },

    hasShippingAddress:{
        type: Boolean,
        default: false,
    },

    shippingAddress:{
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        province: {
            type: String,
        },
        country: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
  
},

{
    timestamps: true,
}

);

//compile schema to model

const User = mongoose.model("User", UserShema)

export default User;