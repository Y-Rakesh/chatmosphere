import mongoose, { Schema } from "mongoose";
const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
        minlength:3,
    },password:{
        type:String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default:"",
    },

},{
    timestamps:true
});


const User=mongoose.model("User",userschema);
export default User;