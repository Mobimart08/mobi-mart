import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import {
  buildOptimizedCloudinaryUrl,
  extractCloudinaryPublicId,
  normalizeProductImages,
} from "../utils/cloudinaryImage.js";

const MAX_PRODUCT_IMAGES = 6;

function formatProductResponse(product) {
  const normalizedImages = normalizeProductImages(product.images);

  return {
    ...product,
    images: normalizedImages,
    image: normalizedImages?.[0] || product.image || null,
  };
}

function sanitizeProductPayload(body) {
  const { name, brand, description, type, images, image, variants } = body;
  const inputImages = Array.isArray(images) ? images : image ? [image] : [];

  return {
    name: typeof name === "string" ? name.trim() : "",
    brand: typeof brand === "string" ? brand.trim() : "",
    description:
      typeof description === "string" ? description.trim() : undefined,
    type: typeof type === "string" ? type.trim() : "",
    images: Array.isArray(inputImages)
      ? inputImages
          .map((image) => (typeof image === "string" ? image.trim() : image))
          .filter(Boolean)
          .map((image) => buildOptimizedCloudinaryUrl(image, "product"))
      : [],
    variants: Array.isArray(variants)
      ? variants.map((variant) => ({
          ...variant,
          storage:
            typeof variant?.storage === "string" ? variant.storage.trim() : "",
          color:
            typeof variant?.color === "string" ? variant.color.trim() : "",
          price:
            typeof variant?.price === "string"
              ? Number(variant.price)
              : variant?.price,
        }))
      : [],
  };
}

function validateProductPayload(body, sanitized) {
  const missingRequiredFields = [];

  if (!sanitized.name) {
    missingRequiredFields.push("name");
  }

  if (!sanitized.brand) {
    missingRequiredFields.push("brand");
  }

  if (!sanitized.type) {
    missingRequiredFields.push("type");
  }

  if (!Array.isArray(body.variants)) {
    missingRequiredFields.push("variants");
  }

  if (missingRequiredFields.length > 1) {
    return "Missing required fields";
  }

  if (!sanitized.name) {
    return "Name is required";
  }

  if (!sanitized.brand) {
    return "Brand is required";
  }

  if (body.description !== undefined && !sanitized.description) {
    return "Description cannot be empty";
  }

  if (!sanitized.type) {
    return "Product type is required";
  }

  if (!["New", "Used"].includes(sanitized.type)) {
    return "Invalid product type";
  }

  if (body.images !== undefined && sanitized.images.length === 0) {
    return "At least one product image is required";
  }

  if (body.images !== undefined && sanitized.images.length !== body.images.length) {
    return "Each image must be a non-empty string";
  }

  if (sanitized.images.length > MAX_PRODUCT_IMAGES) {
    return `You can attach up to ${MAX_PRODUCT_IMAGES} images per product`;
  }

  if (!Array.isArray(body.variants) || sanitized.variants.length === 0) {
    return "At least one variant is required";
  }

  const invalidVariant = sanitized.variants.find(
    (variant) => !variant.storage || !variant.color,
  );

  if (invalidVariant) {
    return "Each variant must include storage and color";
  }

  const invalidPriceVariant = sanitized.variants.find(
    (variant) =>
      typeof variant.price !== "number" ||
      Number.isNaN(variant.price) ||
      variant.price <= 0,
  );

  if (invalidPriceVariant) {
    return "Price must be greater than 0";
  }

  return null;
}

function handleControllerError(error, res) {
  console.error(error);

  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0];
    return res
      .status(400)
      .json({ message: firstError?.message || "Validation failed" });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(500).json({ message: error.message });
}

async function deleteCloudinaryImages(images = []) {
  const publicIds = [...new Set(images.map(extractCloudinaryPublicId).filter(Boolean))];

  if (publicIds.length === 0) {
    return;
  }

  await Promise.all(
    publicIds.map(async (publicId) => {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });

      if (result?.result && !["ok", "not found"].includes(result.result)) {
        throw new Error(`Failed to delete Cloudinary asset: ${publicId}`);
      }
    }),
  );
}

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(
      products.map((product) => ({
        ...formatProductResponse(product.toObject()),
      })),
    );
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(formatProductResponse(product.toObject()));
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const addProduct = async (req, res) => {
  try {
    const sanitized = sanitizeProductPayload(req.body);
    const validationMessage = validateProductPayload(req.body, sanitized);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const product = new Product(sanitized);
    await product.save();

    res.status(201).json(formatProductResponse(product.toObject()));
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const sanitized = sanitizeProductPayload(req.body);
    const validationMessage = validateProductPayload(req.body, sanitized);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      sanitized,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(formatProductResponse(updatedProduct.toObject()));
  } catch (error) {
    handleControllerError(error, res);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await deleteCloudinaryImages(product.images);
    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    handleControllerError(error, res);
  }
};
