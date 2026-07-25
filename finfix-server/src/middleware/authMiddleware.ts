import jwt from "jsonwebtoken";
import {  NextFunction, Response} from "express";
import { SessionInterface } from "../modules/user/user.interface";

export interface JwtPayloadInterface {
  id: string;
  email: string;
}
const authMiddleware = async (req: SessionInterface, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadInterface;
        req.user = decoded;
        next();
    } catch (error) {
        if(error instanceof Error){
            return res.status(500).json({ message: `Error in authMiddleware: ${error.message}` });
        }
    }
};

export default authMiddleware;