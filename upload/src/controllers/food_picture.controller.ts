import { v2 as cloudinary } from "cloudinary";
import express from "express";
import multer from "multer";
import { EStatusCodes } from "../../redifood-module/src/interfaces";
import { currentUser } from "../../redifood-module/src/middlewares/current-user";
import { requireAuth } from "../../redifood-module/src/middlewares/require-auth";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.YOUR_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/api/upload/food-picture", currentUser, requireAuth, upload.single("file"), async (req, res) => {
  const file = req.file?.path as any; // Get the path of the uploaded file

  if (!file) {
    res.status(EStatusCodes.BAD_REQUEST).send({ message: "No file uploaded" });
  }
  // Upload file to Cloudinary
  try {
    const response = cloudinary.uploader.upload(file);
    res.status(EStatusCodes.CREATED).send({ message: "File uploaded to Cloudinary", results: response });
  } catch (err) {
    res.status(EStatusCodes.BAD_REQUEST).send({ message: "Failed to upload file to Cloudinary" });
  }
});
export { router as foodPictureRouter };
