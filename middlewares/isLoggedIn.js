import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";


export const isLoggedIn = (req, res, next)=>{
    //get token from the header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedUser = verifyToken(token);
    //save the user into req obj
    if(!decodedUser){
        throw new Error('invalid/Expired token, please login again');
    }else{
        req.userAuthId = decodedUser?.id;
        next();
    }
    

};