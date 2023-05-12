//brand schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    name:{
        type: String,
        requried: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true,
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],

},
{ timestamps: true }
);

const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;

