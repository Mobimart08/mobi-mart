import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

export const MAX_IMAGE_UPLOADS = 6;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDirectory = path.join(__dirname, "..", "uploads");

fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (_req, file, cb) => {
    const safeBaseName = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 60);

    cb(null, `${Date.now()}-${safeBaseName || "image"}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
  },
});

export function collectUploadedFiles(files) {
  if (Array.isArray(files)) {
    return files;
  }

  if (!files || typeof files !== "object") {
    return [];
  }

  return Object.values(files).flatMap((group) => (Array.isArray(group) ? group : []));
}

export async function cleanupUploadedFiles(files) {
  const uploadedFiles = collectUploadedFiles(files);

  await Promise.all(
    uploadedFiles
      .map((file) => file?.path)
      .filter(Boolean)
      .map((filePath) => fs.promises.unlink(filePath).catch(() => {})),
  );
}

export default upload;
