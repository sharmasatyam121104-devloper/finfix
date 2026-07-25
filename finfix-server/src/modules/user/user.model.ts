import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserInterface } from "./user.interface";

const userSchema = new mongoose.Schema<UserInterface>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    profileImage: {
        type: String
    },
    lastLogin: {
        type: Date
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


const UserModel = mongoose.models.User || mongoose.model<UserInterface>("User", userSchema);

export default UserModel;