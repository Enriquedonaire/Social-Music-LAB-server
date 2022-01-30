import express from "express";
const app = express();

import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import UserRoutes from "./Routes/UserRoutes.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import PostsRoutes from "./Routes/PostsRoutes.js";
const router = express.Router();
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to MongoDB")
});
app.use("/images", express.static(path.join(__dirname, "public/images")));

//MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});

app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/posts", PostsRoutes);


app.listen(5500, () => {
    console.log('Backend server is running!')
})