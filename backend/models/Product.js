import mongoose from "mongoose";

const MAX_PRODUCT_IMAGES = 6;

const variantSchema = new mongoose.Schema(
  {
    storage: {
      type: String,
      required: [true, "Variant storage is required"],
      trim: true,
      validate: {
        validator: (value) => typeof value === "string" && value.trim().length > 0,
        message: "Variant storage is required",
      },
    },
    color: {
      type: String,
      required: [true, "Variant color is required"],
      trim: true,
      validate: {
        validator: (value) => typeof value === "string" && value.trim().length > 0,
        message: "Variant color is required",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than 0"],
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      validate: {
        validator: (value) => typeof value === "string" && value.trim().length > 0,
        message: "Name is required",
      },
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      validate: {
        validator: (value) => typeof value === "string" && value.trim().length > 0,
        message: "Brand is required",
      },
    },
    description: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => value == null || (typeof value === "string" && value.trim().length > 0),
        message: "Description cannot be empty",
      },
    },
    type: {
      type: String,
      required: [true, "Product type is required"],
      enum: {
        values: ["New", "Used"],
        message: "Invalid product type",
      },
    },
    images: {
      type: [String],
      validate: {
        validator: (value) =>
          value == null ||
          (Array.isArray(value) &&
            value.length > 0 &&
            value.length <= MAX_PRODUCT_IMAGES &&
            value.every((image) => typeof image === "string" && image.trim().length > 0)),
        message: `Product images must contain between 1 and ${MAX_PRODUCT_IMAGES} items`,
      },
    },
    variants: {
      type: [variantSchema],
      required: [true, "At least one variant is required"],
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one variant is required",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
