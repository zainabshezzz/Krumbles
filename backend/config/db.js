import mongoose from "mongoose";


export const connectDB =async()=>{
    await mongoose.connect('mongodb+srv://maryamchad:123%21%40%23@cluster0.1uik2fm.mongodb.net/IceCreamParlor').then(()=>console.log("DB connected"))

}