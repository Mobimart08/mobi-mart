import { useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ImageEditorModal from "../components/ImageEditorModal";
import ProductImageManager from "../components/ProductImageManager";
import { useProducts } from "../context/useProducts";
import { useProductImages } from "../hooks/useProductImages";
import CustomDropdown from "../../components/ui/CustomDropdown";
import Spinner from "../../components/ui/Spinner";
import StatusMessage from "../../components/ui/StatusMessage";
import { uploadProductImages } from "../../services/productAPI";

const conditionOptions = [
  { label: "New", value: "New" },
  { label: "Used", value: "Used" },
];

const storageOptions = [
  { label: "Select Storage", value: "" },
  { label: "64GB", value: "64GB" },
  { label: "128GB", value: "128GB" },
  { label: "256GB", value: "256GB" },
  { label: "512GB", value: "512GB" },
  { label: "1TB", value: "1TB" },
];

function buildInitialForm(product) {
  return {
    name: product?.name || "",
    brand: product?.brand || "",
    type: product?.type || "New",
    description: product?.description || "",
  };
}

function buildInitialVariants(product) {
  if (Array.isArray(product?.variants) && product.variants.length > 0) {
    return product.variants.map((variant) => ({
      storage: variant.storage || "",
      color: variant.color || "",
      price: String(variant.price || ""),
    }));
  }

  return [
    {
      storage: product?.storage || "",
      color: "Default",
      price: String(product?.price || ""),
    },
  ];
}

function EditProductForm({ product, onComplete }) {
  const navigate = useNavigate();
  const { updateProduct } = useProducts();
  const [form, setForm] = useState(() => buildInitialForm(product));
  const [variants, setVariants] = useState(() => buildInitialVariants(product));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const {
    previewImages,
    isOptimizingImages,
    resetUploadStates,
    updatePreviewImage,
    removePreviewImage,
    imageManagerProps,
    imageEditorProps,
  } = useProductImages({
    initialImages: product.images || (product.image ? [product.image] : []),
    setErrorMessage: setError,
    setSuccessMessage: setSuccess,
  });

  const addVariant = () => {
    setVariants((prev) => [...prev, { storage: "", color: "", price: "" }]);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, currentIndex) =>
        currentIndex === index ? { ...variant, [field]: value } : variant,
      ),
    );
    setError("");
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.brand.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    if (previewImages.length === 0) {
      setError("Add at least one product image before saving.");
      return;
    }

    if (variants.length === 0) {
      setError("At least 1 variant is required.");
      return;
    }

    for (let i = 0; i < variants.length; i += 1) {
      const variant = variants[i];

      if (!variant.storage || !variant.color.trim() || !variant.price) {
        setError(`Please fill all fields for variant ${i + 1}.`);
        return;
      }

      if (Number(variant.price) <= 0) {
        setError(`Price must be greater than 0 for variant ${i + 1}.`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setUploadedUrls([]);
      setError("");
      setSuccess("");
      resetUploadStates();

      const uploadResult =
        previewImages.length > 0
          ? await uploadProductImages(previewImages, {
              maxRetries: 2,
              onImageUploadStart: (image, attempt) => {
                if (!image.file) {
                  return;
                }

                updatePreviewImage(image.id, () => ({
                  uploadStatus: "uploading",
                  uploadProgress: 0,
                  uploadAttempts: attempt,
                  uploadError: "",
                }));
              },
              onImageUploadProgress: (image, progressEvent) => {
                if (!image.file || !progressEvent.total) {
                  return;
                }

                updatePreviewImage(image.id, () => ({
                  uploadStatus: "uploading",
                  uploadProgress: Math.min(
                    100,
                    Math.round((progressEvent.loaded / progressEvent.total) * 100),
                  ),
                }));
              },
              onImageUploadRetry: (image, retryCount) => {
                if (!image.file) {
                  return;
                }

                updatePreviewImage(image.id, (currentImage) => ({
                  uploadStatus: "retrying",
                  uploadProgress: currentImage.uploadProgress,
                  uploadAttempts: retryCount + 1,
                  uploadError: `Retrying upload (${retryCount}/2)...`,
                }));
              },
              onImageUploadSuccess: (image) => {
                updatePreviewImage(image.id, () => ({
                  uploadStatus: "uploaded",
                  uploadProgress: 100,
                  uploadError: "",
                }));
              },
            })
          : { urls: [], url: null };

      setUploadedUrls(uploadResult.urls);

      await updateProduct(product._id || product.id, {
        name: form.name.trim(),
        brand: form.brand.trim(),
        description: form.description.trim(),
        type: form.type,
        images: uploadResult.urls,
        image: uploadResult.url,
        variants: variants.map((variant) => ({
          storage: variant.storage.trim(),
          color: variant.color.trim(),
          price: Number(variant.price),
        })),
      });

      setSuccess("Product updated successfully. Redirecting...");
      onComplete?.();
      navigate("/admin/products");
    } catch (updateError) {
      setUploadedUrls([]);

      if (updateError.imageId) {
        removePreviewImage(updateError.imageId);
        resetUploadStates();
        setError(
          `${updateError.message || "Image upload failed"}. The failed image was removed. Please review and retry.`,
        );
      } else {
        resetUploadStates();
        setError(
          updateError.response?.data?.message ||
            updateError.response?.data?.error ||
            updateError.message ||
            "Failed to update product.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-3xl font-semibold text-slate-900">Edit Product</h1>
        <p className="mb-6 text-slate-500">Update product details and refine the product gallery before saving.</p>
        <StatusMessage message={error} tone="error" className="mb-3" />
        <StatusMessage message={success} tone="success" className="mb-3" />

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "iPhone 15 Pro Max" },
              { label: "Brand", name: "brand", type: "text", placeholder: "Apple" },
            ].map((field) => (
              <label key={field.name}>
                <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
                <input
                  required
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className="mm-input"
                />
              </label>
            ))}

            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">Condition</span>
              <div className="flex items-center gap-3">
                {conditionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, type: option.value }));
                      setError("");
                    }}
                    className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      form.type === option.value
                        ? "bg-primary text-white shadow-sm"
                        : "bg-gray-100 text-dark hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={4}
                maxLength={500}
                placeholder="Briefly describe key features, condition, and other details..."
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-300"
              />
              <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/500</p>
            </label>

            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">Product Variants</p>
                  <p className="text-sm text-slate-500">Update storage, color, and price variations.</p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="ds-btn-secondary px-3 py-1.5 text-xs"
                >
                  + Add Variant
                </button>
              </div>

              <div className="grid gap-4">
                {variants.map((variant, index) => (
                  <div
                    key={`${product._id || product.id}-variant-${index}`}
                    className="relative grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3"
                  >
                    <div>
                      <span className="mb-1 block text-sm font-medium text-slate-700">Storage</span>
                      <CustomDropdown
                        value={variant.storage}
                        onChange={(value) => updateVariant(index, "storage", value)}
                        options={storageOptions}
                      />
                    </div>

                    <label>
                      <span className="mb-1 block text-sm font-medium text-slate-700">Color</span>
                      <input
                        type="text"
                        placeholder="e.g., Space Black"
                        value={variant.color}
                        onChange={(event) => updateVariant(index, "color", event.target.value)}
                        className="mm-input py-2.5"
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-sm font-medium text-slate-700">Price</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(event) => updateVariant(index, "price", event.target.value)}
                        className="mm-input py-2.5"
                      />
                    </label>

                    {variants.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-sm transition hover:bg-rose-200"
                        title="Remove Variant"
                      >
                        <FiX className="text-sm" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div onClick={() => setUploadedUrls([])}>
            <ProductImageManager
              {...imageManagerProps}
              isSubmitting={isSubmitting}
              uploadedUrlsCount={uploadedUrls.length}
            />
          </div>

          <div className="lg:col-span-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || isOptimizingImages}
              className="ds-btn-primary px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" label="" className="gap-2 text-white" />
                  <span>Updating...</span>
                </>
              ) : (
                "Update Product"
              )}
            </motion.button>
          </div>
        </form>
      </section>
      <ImageEditorModal {...imageEditorProps} />
    </>
  );
}

export default function EditProduct() {
  const { id } = useParams();
  const { products, isLoading } = useProducts();
  const current = products.find((item) => (item._id || item.id) === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Sidebar />
        <main className="p-4 sm:p-6 lg:ml-[260px] lg:p-8">
          <Topbar />
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
            <Spinner label="Loading product editor..." />
          </div>
        </main>
      </div>
    );
  }

  if (!current) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="p-4 sm:p-6 lg:ml-[260px] lg:p-8">
        <Topbar />
        <EditProductForm key={current._id || current.id} product={current} />
      </main>
    </div>
  );
}
