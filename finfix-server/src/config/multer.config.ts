import multer from "multer";
import path from "path";
import fs from "fs";
import { SessionInterface } from "../modules/user/user.interface";


const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req: SessionInterface, file, cb) {
            const userId = req.user?.id; 
            const ext = path.extname(file.originalname);
            cb(null, `${userId}${ext}`);
    },
});

export const upload = multer({ storage,   limits: {
    fileSize: 5 * 1024 * 1024, 
  }, });  

