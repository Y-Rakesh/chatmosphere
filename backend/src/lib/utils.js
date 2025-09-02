import jwt from "jsonwebtoken"

export const generatetoken=(userId,res)=>{

  const token =jwt.sign({userId},process.env.jwtkey,{expiresIn:"7d"})
  res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,//in ms
    httpOnly:true,//prevents xss cross scripting attacks
    sameSite:"none",//prevent csrf attacks
    secure:process.env.NODE_ENV!=="development"
  })
return token;


}
