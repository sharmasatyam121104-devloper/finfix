import { Request } from "express"
export interface UserInterface {
    fullname: string;
    email: string;
    password: string;
    role: string;
    profileImage: string;
    lastLogin: Date;
    otp: string;
    otpExpiry: Date;
    isVerified: boolean
}

export interface SessionInterface extends Request{
    user?: {
        email: string;
        id: string
    }
}