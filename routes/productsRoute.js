import express from "express";
import upload from "../config/fileUpload.js";
import { createProductCtrl, getProductsCtrl, getProductCtrl, updateProductCtrl, deleteProductCtrl, } from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedin.js";
import isAdmin from "../middlewares/isAdmin.js";


const productRouter = express.Router();

productRouter.post("/", isLoggedIn, isAdmin, upload.array("files") ,createProductCtrl);
productRouter.get("/" ,  getProductsCtrl);
productRouter.get("/:id" , getProductCtrl);
productRouter.put("/:id", isLoggedIn ,isAdmin,updateProductCtrl);
productRouter.delete("/:id/delete", isLoggedIn ,isAdmin,deleteProductCtrl);


export default productRouter;