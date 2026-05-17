import express from "express";
import multer from "multer";
import { uploadImages } from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  cleanupUploadedFiles,
  MAX_IMAGE_UPLOADS,
} from "../middleware/upload.js";
import upload from "../middleware/upload.js";

const router = express.Router();

function sendUploadError(res, status, message) {
  return res.status(status).json({ error: message, message });
}

router.post("/", authMiddleware, (req, res, next) => {
  upload.array("images", MAX_IMAGE_UPLOADS)(req, res, async (error) => {
    if (!error) {
      next();
      return;
    }

    await cleanupUploadedFiles(req.files);

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return sendUploadError(res, 413, "Each image must be 5 MB or smaller");
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
      return sendUploadError(res, 400, `You can upload up to ${MAX_IMAGE_UPLOADS} images at once`);
    }

    return sendUploadError(res, 400, error.message || "Failed to process images");
  });
}, uploadImages);

export default router;
