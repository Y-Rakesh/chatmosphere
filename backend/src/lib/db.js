 import mongoose from "mongoose"
 export const connectdb=async()=>{
    try {
       const con= await mongoose.connect(process.env.dburl);
        console.log(`db conncectedd successfully:${con.connection.host}`);
    } catch (error) {
        console.log("db eroor:",error);
    }
 };
