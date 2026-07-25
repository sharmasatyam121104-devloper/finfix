import { Router } from "express";
import { login, signup, verifyRegisterdUser, upload_profile_picture, changePassword, forgotPassword, resetPassword, logout, getMe } from "./user.controller";
import authMiddleware from "../../middleware/authMiddleware";
import { upload } from "../../config/multer.config";

const UserRouter = Router();

UserRouter.post("/signup", signup);
UserRouter.post("/otp-verify", verifyRegisterdUser);
UserRouter.post("/login", login);
UserRouter.put("/profile-image", authMiddleware, upload.single("image"), upload_profile_picture);
UserRouter.put("/change-password", authMiddleware, changePassword);
UserRouter.post("/forgot-password", forgotPassword);
UserRouter.post("/reset-password", resetPassword);
UserRouter.get("/logout", authMiddleware, logout);
UserRouter.get("/getMe", authMiddleware, getMe);


export default UserRouter;