import "dotenv/config";

import connectDB from "./config/db.config";
connectDB();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));


import UserRouter from "./modules/user/user.routes";
app.use('/user', UserRouter)

app.get("/", (_req, res) => {
  res.json({
    message: "FinFix Server is running up.",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});