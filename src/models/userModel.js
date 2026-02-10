import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: [true, "Username is required!"],
        unique: true,
    },
    email:{
        type: String,
        required: [true, "Email is required!"],
        unique:true,
    },
    password:{
        type: String,
        required: [true, "password is required!"]
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    avatar: {
        type: String,
        default: "",
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

// database thing
const User = mongoose.models.users || mongoose.model(
    "users", userSchema
);

export default User;