import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    username:{
        type:String,
        required:[true,"Username is required"],
    },
    role:{
        type:String,
        enum: ["admin","paidUser", "freeUser"],
        default: "freeUser",      
    },
    verifyToken: String,
    verifyTokenExpiry: Date,
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User