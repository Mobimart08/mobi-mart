export const MAX_PRODUCT_IMAGES = 6;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function moveItem(items, fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function createPreviewImageId() {
  return `image-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildPreviewImage(optimizedImage, overrides = {}) {
  return {
    id: createPreviewImageId(),
    file: optimizedImage.file,
    previewUrl: optimizedImage.previewUrl,
    remoteUrl: null,
    originalName: optimizedImage.originalName,
    originalSize: optimizedImage.originalSize,
    optimizedSize: optimizedImage.optimizedSize,
    reductionPercent: optimizedImage.reductionPercent,
    uploadStatus: "ready",
    uploadProgress: 0,
    uploadAttempts: 0,
    uploadError: "",
    source: "local",
    ...overrides,
  };
}

export function buildExistingPreviewImage(url, index) {
  return {
    id: `existing-${index}-${Math.random().toString(36).slice(2, 8)}`,
    file: null,
    previewUrl: url,
    remoteUrl: url,
    originalName: `Current image ${index + 1}`,
    originalSize: 0,
    optimizedSize: 0,
    reductionPercent: 0,
    uploadStatus: "uploaded",
    uploadProgress: 100,
    uploadAttempts: 1,
    uploadError: "",
    source: "remote",
  };
}

export function createPreviewImagesFromUrls(urls = []) {
  return urls.filter(Boolean).map((url, index) => buildExistingPreviewImage(url, index));
}

export function revokePreviewImage(image) {
  if (image?.previewUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(image.previewUrl);
  }
}

export function getResetUploadState(image) {
  if (image.file) {
    return {
      uploadStatus: "ready",
      uploadProgress: 0,
      uploadAttempts: 0,
      uploadError: "",
    };
  }

  return {
    uploadStatus: "uploaded",
    uploadProgress: 100,
    uploadAttempts: 1,
    uploadError: "",
  };
}

export function getImageValidationError(file) {
  if (!(file instanceof File)) {
    return "Invalid image file.";
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return `${file.name} must be JPG, PNG, or WEBP.`;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `${file.name} is larger than 5 MB.`;
  }

  return null;
}
