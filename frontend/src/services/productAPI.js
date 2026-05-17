import { apiClient } from "./apiClient";

const productAPI = {
  get: (url, config) => apiClient.get(`/products${url}`, config),
  post: (url, data, config) => apiClient.post(`/products${url}`, data, config),
  put: (url, data, config) => apiClient.put(`/products${url}`, data, config),
  delete: (url, config) => apiClient.delete(`/products${url}`, config),
};

const uploadAPI = {
  post: (url, data, config) => apiClient.post(`/upload${url}`, data, config),
};

async function uploadSingleProductImage(file, options = {}) {
  const formData = new FormData();
  formData.append("images", file);

  const response = await uploadAPI.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (typeof options.onUploadProgress === "function") {
        options.onUploadProgress(progressEvent);
      }
    },
  });

  const imageUrls = Array.isArray(response.data?.urls)
    ? response.data.urls
    : response.data?.url
      ? [response.data.url]
      : [];

  return imageUrls[0] || null;
}

export async function getProducts() {
  const response = await productAPI.get("/");
  return Array.isArray(response.data) ? response.data : [];
}

export async function getProductById(id) {
  const response = await productAPI.get(`/${id}`);
  return response.data;
}

export async function addProduct(data) {
  const response = await productAPI.post("/", data);
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await productAPI.put(`/${id}`, data);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await productAPI.delete(`/${id}`);
  return response.data;
}

export async function uploadProductImages(images, options = {}) {
  const urls = [];
  const maxRetries = Number.isInteger(options.maxRetries) ? options.maxRetries : 2;

  for (const image of images) {
    if (!image?.file && image?.remoteUrl) {
      urls.push(image.remoteUrl);
      options.onImageUploadSuccess?.(image, image.remoteUrl, 0);
      continue;
    }

    let attempt = 0;
    let uploadedUrl = null;

    while (attempt <= maxRetries && !uploadedUrl) {
      const currentAttempt = attempt + 1;

      try {
        options.onImageUploadStart?.(image, currentAttempt);

        uploadedUrl = await uploadSingleProductImage(image.file, {
          onUploadProgress: (progressEvent) => {
            options.onImageUploadProgress?.(image, progressEvent, currentAttempt);
          },
        });

        if (!uploadedUrl) {
          throw new Error("Image upload failed");
        }

        urls.push(uploadedUrl);
        options.onImageUploadSuccess?.(image, uploadedUrl, currentAttempt);
      } catch (error) {
        if (attempt >= maxRetries) {
          const uploadMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Image upload failed";
          const uploadError = new Error(uploadMessage);
          uploadError.imageId = image.id;
          uploadError.status = error.response?.status;
          uploadError.response = error.response;
          uploadError.originalError = error;
          throw uploadError;
        }

        attempt += 1;
        options.onImageUploadRetry?.(image, attempt, error);
      }
    }
  }

  return {
    urls,
    url: urls[0] || null,
  };
}
