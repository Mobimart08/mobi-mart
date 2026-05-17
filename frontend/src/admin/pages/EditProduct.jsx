import { useState } from "react";
import { motion } from "framer-motion";
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

function buildInitialForm(product) {
  const firstVariant = product?.variants?.[0];

  return {
    name: product?.name || "",
    brand: product?.brand || "",
    storage: firstVariant?.storage || product?.storage || "",
    type: product?.type || "New",
    price: String(firstVariant?.price || product?.price || ""),
  };
}

function EditProductForm({ product, onComplete }) {
  const navigate = useNavigate();
  const { updateProduct } = useProducts();
  const firstVariant = product.variants?.[0];
  const [form, setForm] = useState(() => buildInitialForm(product));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const {
    previewImages,
    resetUploadStates,
    updatePreviewImage,
    imageManagerProps,
    imageEditorProps,
  } = useProductImages({
    initialImages: product.images || (product.image ? [product.image] : []),
    setErrorMessage: setError,
    setSuccessMessage: setSuccess,
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.brand.trim() || !form.storage.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    if (!Number(form.price) || Number(form.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
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
        description: product.description || "",
        type: form.type,
        images: uploadResult.urls,
        variants: [
          {
            storage: form.storage.trim(),
            color: firstVariant?.color || "Default",
            price: Number(form.price),
          },
        ],
      });

      setSuccess("Product updated successfully. Redirecting...");
      onComplete?.();
      navigate("/admin/products");
    } catch (updateError) {
      setError(
        updateError.response?.data?.message ||
          updateError.response?.data?.error ||
          updateError.message ||
          "Failed to update product.",
      );
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

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "iPhone 15 Pro Max" },
              { label: "Brand", name: "brand", type: "text", placeholder: "Apple" },
              { label: "Storage", name: "storage", type: "text", placeholder: "256GB" },
              { label: "Price", name: "price", type: "number", placeholder: "159900" },
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

            <div className="md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">Condition</span>
              <CustomDropdown
                value={form.type}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, type: value }));
                  setError("");
                }}
                options={conditionOptions}
              />
            </div>

            <div className="md:col-span-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="ds-btn-primary px-6 py-3 text-sm"
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
          </div>

          <div onClick={() => setUploadedUrls([])}>
            <ProductImageManager
              {...imageManagerProps}
              isSubmitting={isSubmitting}
              uploadedUrlsCount={uploadedUrls.length}
            />
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
