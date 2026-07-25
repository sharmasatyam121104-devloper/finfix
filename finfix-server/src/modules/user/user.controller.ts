import { Request, Response } from "express"
import UserModel from "./user.model";
import { customAlphabet } from "nanoid"
import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SessionInterface } from "./user.interface";
import { sendMail } from "../../utils/mail.utils";
import { forgotPasswordTemplate, verifyAccountTemplate } from "../../templates/email.template";

export const signup = async(req: Request, res: Response)=>{
    try {
        const {fullname, email, password} = req.body;

        if(!fullname || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await UserModel.findOne({email})
        if(user){
            return res.status(400).json({message: "User already exists"})
        }

        let genratedOtp = customAlphabet("0123456789", 4)
        const otp = genratedOtp();

        const incryptedOtp = crypto.createHash("sha256").update(otp).digest("hex");
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await UserModel.create({fullname, email, password: hashedPassword, otp: incryptedOtp, otpExpiry})
        if(!newUser){
            return res.status(400).json({message: "User could not be created"})
        }
        
        await sendMail({
            to: newUser?.email,
            subject: "Verify your account",
            html: verifyAccountTemplate(otp),
        });
        return res.status(201).json({message: "User created successfully, Please check your email for verification code.", otp})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in signup controller: ${error.message}`})    
        }
    }
}

export const verifyRegisterdUser = async(req: Request, res: Response)=>{
    try {
        const {email, otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        if(user.isVerified){
            return res.status(400).json({message: "User is already verified"})
        }

        if(!user.otp){
            return res.status(400).json({message: "User not requested for otp"})
        }

        if(user.otpExpiry < new Date()){
            return res.status(400).json({message: "Verification code has expired"})
        }

        const decryptedOtp = crypto.createHash("sha256").update(otp).digest("hex");
        if(user.otp !== decryptedOtp){
            return res.status(400).json({message: "Invalid verification code"})
        }

        if(user.otpExpiry < new Date()){
            return res.status(400).json({message: "Verification code has expired"})
        }

        user.otp = null;
        user.otpExpiry = null;
        user.isVerified = true;
        await user.save();

        return res.status(200).json({message: "User verified successfully"})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in verifyRegisterdUser controller: ${error.message}`})    
        }
    }
}


export const login = async(req: Request, res: Response)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        if(!user.isVerified){
            return res.status(400).json({message: "User is not verified"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        console.log("isPasswordCorrect", isPasswordCorrect, "user.password", user.password, "password", password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid password"})
        }

        const jwtPayload = {
            email: user.email,
            id: user._id
        }

        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {expiresIn: "7d"})

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({message: "User logged in successfully"})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in login controller: ${error.message}`})
        }    
    }
}

export const upload_profile_picture = async(req: SessionInterface, res: Response)=>{
    try {
        const userId = req.user?.id;
        const imgUrl = `${process.env.SERVER_URL}/uploads/${req.file?.filename}` || req.file?.path;
        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        user.profilePicture = imgUrl;
        await user.save();
        return res.status(200).json({message: "Profile picture uploaded successfully",imageUrl: user.profilePicture})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in upload_profile_picture controller: ${error.message}`})
        }
    }
}

export const changePassword = async(req: SessionInterface, res: Response)=>{
    try {
        const userId = req.user?.id;
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({message: "All fields are required"})
        }

        if(oldPassword === newPassword){
            return res.status(400).json({message: "New password cannot be same as old password"})
        }

        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid password"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({message: "Password changed successfully"})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in changePassword controller: ${error.message}`})
        }
    }
}


export const forgotPassword = async(req: Request, res: Response)=>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message: "Email is required"})
        }

        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        let genratedOtp = customAlphabet("0123456789", 4)
        const otp = genratedOtp();
        const incryptedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        user.otp = incryptedOtp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendMail({
            to: user?.email,
            subject: "Reset your password",
            html: forgotPasswordTemplate(otp),
        });

        return res.json({message: "Please check your email for verification code.", otp})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in forgotPassword controller: ${error.message}`})
        }
    }
}

export const resetPassword = async(req: Request, res: Response)=>{
    try {
        const {email, otp, newPassword} = req.body;
        if(!email || !otp || !newPassword){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({message: "User does not exist"})
        }

        const decryptedOtp = crypto.createHash("sha256").update(otp).digest("hex");
        if(user.otp !== decryptedOtp){
            return res.status(400).json({message: "Invalid verification code"})
        }

        const otpExpiry = user.otpExpiry;
        if(new Date() > otpExpiry){
            return res.status(400).json({message: "Verification code has expired"})
        }    

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({message: "Password reset successfully"})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in resetPassword controller: ${error.message}`})
        }
    }
}

export const logout = async(req: SessionInterface, res: Response)=>{
    try {
        res.clearCookie("token", {httpOnly: true, secure: true, sameSite: "none"});
        return res.status(200).json({message: "Logout successfully"})
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in logout controller: ${error.message}`})
        }
    }
}
export const getMe = async(req: SessionInterface, res: Response)=>{
    try {
        const userId = req.user?.id;
        const user = await UserModel.findById(userId).select("-password -otp -otpExpiry -role");
        return res.status(200).json(user)
    } 
    catch (error) {
        if(error instanceof Error){
            return res.status(500).json({message: `Error in getMe controller: ${error.message}`})
        }
    }
}