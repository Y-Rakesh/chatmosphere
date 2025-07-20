import cloudinary from "../lib/cloudinary.js";
import { generatetoken } from "../lib/utils.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs"

export const signup=async (req,res)=>{
  const {fullName,email,password}=req.body;
  try {
    if(!fullName||!email||!password){
      return res.status(400).json({message:"all fields are required"});
    }
    //hash passwords using bcrypt
    if(password.length<6)return res.status(400).json({message:"password must be at least 6 char"});
    const user=await User.findOne({email})
    if(user) return res.status(400).json({message:"Email already  Exists"});

    const salt =await bcrypt.genSalt(10);
    const hashed=await bcrypt.hash(password,salt)
    const newUser =new User({
      fullName,
      email,
      password:hashed
    })
   if(newUser){
     await newUser.save();
      generatetoken(newUser._id,res)
      res.status(200).json({_id:newUser._id,fullName:newUser.fullName,email:newUser.email,profilePic:newUser.profilePic})
   }else{
    res.status(400).json({message:"Invalid user data"})
   }



  } catch (error) {
    console.log("Error in signup controller",error
      .message
    );
    res.status(500).json
    ({message:"Internal server error"})
  }
}
export const login=async (req,res)=>{
  const{email, password}=req.body;
    try {
      console.log("REQ BODY:", req.body);
      const user = await User.findOne({ email })

      if(!user){
       return  res.status(400).json({message:"invalid credentials"})
      }
    
      const ispasswordvalid=await bcrypt.compare(password,user.password)
      

        if(!ispasswordvalid){
       return  res.status(400).json({message:"invalid credentials"})
      }
      generatetoken(user._id,res)
      res.status(200).json({_id:user._id,fullName:user.fullName,email:user.email,profilePic:user.profilePic})


    } catch (error) {
      console.log("Error in login controller",error.message);
      console.log(error);
      res.status(500).json({message:"Internal server error"})
    }




}
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Optional: ensures it's HTTPS-only in production
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Internal server error", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateprofile=async (req,res)=>{
  try {
    const {profilePic}=req.body;
    const userId=req.user._id
    if(!profilePic){
      return res.status(400).json({message:"Profile pic is required"});
    }
    const uploadresponse=await cloudinary.uploader.upload(profilePic)
    const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadresponse.secure_url},{new:true})
    res.status(200).json({updateUser});

  } catch (error) {
    console.log("update error",error)
    res.status(500).json({message:"Internal server error"});
  }
}



export const checkAuth=(req,res)=>{
 try {
  res.status(200).json(req.user);


 } catch (error) {
  console.log("Error in checkauth controller",error.message);
  res.status(500).json({message:"Internal server error"});
 }

}