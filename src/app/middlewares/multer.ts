import multer from "multer";
import path from "path";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "fs/promises"
import { TCloudinaryResponse } from "../types/file";
cloudinary.config({
  cloud_name: "dbe3ewhey",
  api_key: "852926166263824",
  api_secret: "9xvKHPqhj1kbitrf7v5h2XzhpHk", // Click 'View API Keys' above to copy your API secret
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export const uploadToCloud = async (file:any): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: file.originalname,
    });
    await fs.unlink(file.path);
    return result; 
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error; 
  } 
    
  
};

export default upload;
