import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";
import { buildOptimizedCloudinaryUrl } from "../utils/cloudinaryImage.js";
import { collectUploadedFiles, MAX_IMAGE_UPLOADS } from "../middleware/upload.js";

function sendUploadError(res, status, message) {
  return res.status(status).json({ error: message, message });
}

async function uploadSingleImage(file) {
  console.log("[uploadSingleImage] Uploading file path:", file.path);
  const uploadedImage = await cloudinary.uploader.upload(file.path, {
    folder: "mobimart",
    resource_type: "image",
    use_filename: true,
    unique_filename: true,
    transformation: [
      {
        width: 800,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });
  console.log("[uploadSingleImage] Cloudinary response:", uploadedImage);

  return buildOptimizedCloudinaryUrl(uploadedImage.secure_url, "product");
}

export const uploadImages = async (req, res) => {
  const files = collectUploadedFiles(req.files);

  try {
    console.log("[uploadImages] CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("[uploadImages] req.files:", req.files);
    console.log("[uploadImages] normalized files:", files);

    if (!files || files.length === 0) {
      return sendUploadError(res, 400, "No images uploaded");
    }

    if (files.length > MAX_IMAGE_UPLOADS) {
      return sendUploadError(res, 400, `Max ${MAX_IMAGE_UPLOADS} images allowed`);
    }

    const urls = [];

    for (const file of files) {
      console.log("[uploadImages] file.path:", file.path);
      const url = await uploadSingleImage(file);
      urls.push(url);
    }

    return res.status(201).json({
      urls,
      url: urls[0] || null,
    });
  } catch (error) {
    console.error("[uploadImages] Full error object:", error);
    console.error("[uploadImages] Error stack:", error?.stack);
    return res.status(500).json({
      error: error?.message || "Failed to upload images to Cloudinary",
      message: error?.message || "Failed to upload images to Cloudinary",
      stack: error?.stack || null,
    });
  } finally {
    await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {})));
  }
};
