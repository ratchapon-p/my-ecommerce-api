//category schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name:{
        type: String,
        requried: true,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true,
    },

    image:{
        type: String,
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

const Category = mongoose.model("Catagory", CategorySchema);

export default Category;
