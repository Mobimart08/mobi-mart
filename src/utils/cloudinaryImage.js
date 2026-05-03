const CLOUDINARY_TRANSFORMATIONS = {
  thumbnail: "c_limit,f_auto,q_auto,w_300",
  product: "c_limit,f_auto,q_auto,w_500",
  hero: "c_limit,f_auto,q_auto,w_800",
};

export function getCloudinaryImageUrl(url, size = "product") {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const transformation = CLOUDINARY_TRANSFORMATIONS[size] || CLOUDINARY_TRANSFORMATIONS.product;
  const uploadMarker = "/upload/";
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return url;
  }

  const prefix = url.slice(0, uploadIndex + uploadMarker.length);
  const suffix = url.slice(uploadIndex + uploadMarker.length);
  const [firstSegment = "", ...restSegments] = suffix.split("/");

  if (firstSegment && /^v\d+$/.test(firstSegment)) {
    return `${prefix}${transformation}/${suffix}`;
  }

  return `${prefix}${transformation}/${restSegments.join("/")}`;
}
