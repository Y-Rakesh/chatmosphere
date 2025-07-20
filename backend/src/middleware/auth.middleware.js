import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
export const protectRoute= async (req,res,next)=>{
try {
    const token =req.cookies.jwt;
    if(!token){
       return  res.status(401).json({message:"Unauthorized-No Token Provided"});
    }
  
    const decoded=jwt.verify(token,process.env.jwtkey);
    if(!decoded){
        return res.status(400).json({message:"token is invalid"});
    }
  const user=await User.findById(decoded.userId).select("-password");
  if(!user){
    return res.status(400).json({message:"User not found"})
  }
  req.user=user
  next()

} catch (error) {
    console.log("Error in protect route",error.message);
    res.status(500).json({message:"Internal server error"})
}
}