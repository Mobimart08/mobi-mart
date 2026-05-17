const MAX_IMAGE_DIMENSION = 800;
const TARGET_QUALITY = 0.7;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Unable to read ${file.name}`));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed"));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function getResizedDimensions(width, height) {
  if (width <= MAX_IMAGE_DIMENSION) {
    return { width, height };
  }

  const scale = MAX_IMAGE_DIMENSION / width;

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function optimizeImageFile(file) {
  if (!(file instanceof File)) {
    throw new Error("Invalid image file");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not a supported image.`);
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name} is larger than 5 MB.`);
  }

  const image = await loadImage(file);
  const { width, height } = getResizedDimensions(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Image compression is not supported in this browser.");
  }

  context.drawImage(image, 0, 0, width, height);

  let blob;
  let outputType = "image/webp";

  try {
    blob = await canvasToBlob(canvas, outputType, TARGET_QUALITY);
  } catch {
    outputType = "image/jpeg";
    blob = await canvasToBlob(canvas, outputType, TARGET_QUALITY);
  }

  const extension = outputType === "image/webp" ? "webp" : "jpg";
  const normalizedName = file.name.replace(/\.[^.]+$/, "");
  const optimizedFile = new File([blob], `${normalizedName}.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  });

  const previewUrl = URL.createObjectURL(optimizedFile);

  return {
    file: optimizedFile,
    previewUrl,
    originalName: file.name,
    originalSize: file.size,
    optimizedSize: optimizedFile.size,
    reductionPercent: Math.max(
      0,
      Math.round((1 - optimizedFile.size / Math.max(file.size, 1)) * 100),
    ),
  };
}
