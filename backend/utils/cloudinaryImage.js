const CLOUDINARY_SIZE_TRANSFORMATIONS = {
  thumbnail: "c_limit,f_auto,q_auto,w_300",
  product: "c_limit,f_auto,q_auto,w_500",
  hero: "c_limit,f_auto,q_auto,w_800",
};

export function isCloudinaryUrl(url) {
  return typeof url === "string" && url.includes("res.cloudinary.com");
}

function injectTransformation(url, transformation) {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const uploadMarker = "/upload/";
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return url;
  }

  const prefix = url.slice(0, uploadIndex + uploadMarker.length);
  const suffix = url.slice(uploadIndex + uploadMarker.length);
  const [firstSegment = "", ...remainingSegments] = suffix.split("/");

  if (firstSegment && /^v\d+$/.test(firstSegment)) {
    return `${prefix}${transformation}/${suffix}`;
  }

  return `${prefix}${transformation}/${remainingSegments.join("/")}`;
}

export function buildOptimizedCloudinaryUrl(url, size = "product") {
  const transformation =
    CLOUDINARY_SIZE_TRANSFORMATIONS[size] || CLOUDINARY_SIZE_TRANSFORMATIONS.product;

  return injectTransformation(url, transformation);
}

export function normalizeProductImages(images) {
  if (!Array.isArray(images)) {
    return images;
  }

  return images.map((image) => buildOptimizedCloudinaryUrl(image, "product"));
}

export function extractCloudinaryPublicId(url) {
  if (!isCloudinaryUrl(url)) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const uploadIndex = pathSegments.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    const afterUploadSegments = pathSegments.slice(uploadIndex + 1);
    const versionIndex = afterUploadSegments.findIndex((segment) => /^v\d+$/.test(segment));
    const assetSegments =
      versionIndex >= 0
        ? afterUploadSegments.slice(versionIndex + 1)
        : afterUploadSegments.filter((segment) => !segment.includes(","));

    if (assetSegments.length === 0) {
      return null;
    }

    const joinedPath = assetSegments.join("/");
    return joinedPath.replace(/\.[^.]+$/, "");
  } catch {
    return null;
  }
}
