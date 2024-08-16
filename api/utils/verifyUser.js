import { errorHandler } from "./error.js";
import { verify } from "jsonwebtoken";
export async function verifyUser(req,res,next){    
        const token = req.cookies.access_token;
        if(!token){
          return next(errorHandler(401, "Please login first"))
        }
        verify(token, process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return next(errorHandler(403, "Please login again"))
            }
            // console.log("User",user);
            req.user = user;
            next();
        });
}