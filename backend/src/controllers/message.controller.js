import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/usermodel.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getusersforsidebar=async (req,res)=>{
    try {
        const loggeduserid=req.user._id;
        const filterusers=await User.find({_id:{$ne:loggeduserid}}).select("-password");
        res.status(200).json(filterusers);

    } catch (error) {
        console.error("Error in getting users for sidebar",error.message);
        res.status(500).json({error:"Internal server error"});

    }    

}

export const getmessages=async(req,res)=>{

try {
    const {id:usertochatid} =req.params
   const myid=req.user._id;
   const messages=await Message.find({$or:[
    {senderId:myid,receiverId:usertochatid},
    {senderId:usertochatid,receiverId:myid}
   ]})
    res.status(200).json(messages)
} catch (error) {
    console.log("Error  in getting message controller:",error.message);
}




}

export const sendmessage=async (req,res)=>{
try {
    const{text,image}=req.body;
    const{id:receiverId}=req.params;;
   const senderId=req.user._id;
   let imageurl ;
   if(image){
    const uploadresponse=await cloudinary.uploader.upload(image);
    imageurl=uploadresponse.secure_url;
   }
   const newMessage=new Message({
    senderId,
    receiverId,
    text,
    image:imageurl,
   })
   await newMessage.save();
   //realtime functionality
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage )
} catch (error) {
    console.log("Error in send message controller",error.message);
    res.status(500).json({error:"Error in sendmessage controller"});

}

}



