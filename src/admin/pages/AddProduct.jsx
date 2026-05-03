import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiUpload, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useProducts } from "../context/useProducts";
import CustomDropdown from "../../components/ui/CustomDropdown";
import Spinner from "../../components/ui/Spinner";
import StatusMessage from "../../components/ui/StatusMessage";
import { uploadProductImages } from "../../services/productAPI";
import { formatFileSize, optimizeImageFile } from "../../utils/imageUpload";

const MAX_IMAGES = 6;

const initialForm = {
  name: "",
  brand: "",
  type: "New",
  description: "",
};

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

function moveItem(items, fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function createPreviewImageId() {
  return `image-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildPreviewImage(optimizedImage) {
  return {
    id: createPreviewImageId(),
    file: optimizedImage.file,
    previewUrl: optimizedImage.previewUrl,
    originalName: optimizedImage.originalName,
    originalSize: optimizedImage.originalSize,
    optimizedSize: optimizedImage.optimizedSize,
    reductionPercent: optimizedImage.reductionPercent,
    uploadStatus: "ready",
    uploadProgress: 0,
    uploadAttempts: 0,
    uploadError: "",
  };
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [form, setForm] = useState(initialForm);
  const [variants, setVariants] = useState([{ storage: "", color: "", price: "" }]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizingImages, setIsOptimizingImages] = useState(false);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState(null);
  const fileInputRef = useRef(null);
  const previewImagesRef = useRef([]);

  useEffect(() => {
    previewImagesRef.current = previewImages;
  }, [previewImages]);

  useEffect(() => {
    return () => {
      previewImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  const updatePreviewImage = (imageId, updater) => {
    setPreviewImages((prev) =>
      prev.map((image) => (image.id === imageId ? { ...image, ...updater(image) } : image)),
    );
  };

  const revokeAndRemovePreviewImage = (imageId) => {
    setPreviewImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return prev.filter((image) => image.id !== imageId);
    });
  };

  const addVariant = () => {
    setVariants([...variants, { storage: "", color: "", price: "" }]);
  };

  const removeVariant = (index) => {
    const updated = variants.filter((_, currentIndex) => currentIndex !== index);
    setVariants(updated);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetUploadStates = () => {
    setPreviewImages((prev) =>
      prev.map((image) => ({
        ...image,
        uploadStatus: "ready",
        uploadProgress: 0,
        uploadAttempts: 0,
        uploadError: "",
      })),
    );
  };

  const validateAndOptimizeImages = async (incomingFiles) => {
    const files = Array.from(incomingFiles || []);
    if (files.length === 0) {
      return;
    }

    const invalid = files.some((file) => !file.type.startsWith("image/"));
    if (invalid) {
      throw new Error("Only image files are allowed.");
    }

    if (previewImagesRef.current.length + files.length > MAX_IMAGES) {
      throw new Error(`You can upload a maximum of ${MAX_IMAGES} images.`);
    }

    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFile) {
      throw new Error(`${oversizedFile.name} is larger than 5 MB.`);
    }

    setIsOptimizingImages(true);
    setError("");
    setSuccess("");

    try {
      const optimizedImages = await Promise.all(
        files.map(async (file) => buildPreviewImage(await optimizeImageFile(file))),
      );

      setPreviewImages((prev) => [...prev, ...optimizedImages]);
      setUploadedUrls([]);
      setSuccess(
        `${optimizedImages.length} image${optimizedImages.length > 1 ? "s are" : " is"} ready. Drag cards to set carousel order.`,
      );
    } finally {
      setIsOptimizingImages(false);
    }
  };

  const onFilesSelected = async (event) => {
    try {
      await validateAndOptimizeImages(event.target.files);
    } catch (selectionError) {
      setError(selectionError.message || "Failed to optimize selected images.");
    } finally {
      event.target.value = "";
    }
  };

  const onDropZoneDragOver = (event) => {
    event.preventDefault();
    setIsDropZoneActive(true);
  };

  const onDropZoneDragLeave = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setIsDropZoneActive(false);
  };

  const onDropZoneDrop = async (event) => {
    event.preventDefault();
    setIsDropZoneActive(false);

    try {
      await validateAndOptimizeImages(event.dataTransfer.files);
    } catch (dropError) {
      setError(dropError.message || "Failed to process dropped images.");
    }
  };

  const removeImage = (imageId) => {
    revokeAndRemovePreviewImage(imageId);
    setUploadedUrls([]);
  };

  const onImageDragStart = (imageId) => {
    setDraggedImageId(imageId);
  };

  const onImageDragOver = (event, targetImageId) => {
    event.preventDefault();

    if (!draggedImageId || draggedImageId === targetImageId || isSubmitting) {
      return;
    }

    setPreviewImages((prev) => {
      const fromIndex = prev.findIndex((image) => image.id === draggedImageId);
      const toIndex = prev.findIndex((image) => image.id === targetImageId);
      return moveItem(prev, fromIndex, toIndex);
    });
    setUploadedUrls([]);
  };

  const onImageDragEnd = () => {
    setDraggedImageId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.brand.trim()) {
      setError("Please fill all required fields.");
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
                updatePreviewImage(image.id, () => ({
                  uploadStatus: "uploading",
                  uploadProgress: 0,
                  uploadAttempts: attempt,
                  uploadError: "",
                }));
              },
              onImageUploadProgress: (image, progressEvent) => {
                if (!progressEvent.total) {
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

      await addProduct({
        name: form.name.trim(),
        brand: form.brand.trim(),
        type: form.type,
        description: form.description.trim(),
        images: uploadResult.urls,
        image: uploadResult.url,
        variants: variants.map((variant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      });

      setSuccess("Product saved successfully. Redirecting...");
      navigate("/admin/products");
    } catch (submitError) {
      setUploadedUrls([]);

      if (submitError.imageId) {
        revokeAndRemovePreviewImage(submitError.imageId);
        resetUploadStates();
        setError(
          `${submitError.message || "Image upload failed"}. The failed image was removed. Please review and retry.`,
        );
      } else {
        resetUploadStates();
        setError(
          submitError.response?.data?.message ||
            submitError.response?.data?.error ||
            submitError.message ||
            "Failed to save product.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="p-4 sm:p-6 lg:ml-[260px] lg:p-8">
        <Topbar />
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-3xl font-semibold text-slate-900">Add Product</h1>
          <p className="mb-6 text-slate-500">Create a new product entry for inventory.</p>
          <StatusMessage message={error} tone="error" className="mb-3" />
          <StatusMessage message={success} tone="success" className="mb-3" />

          <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Name", name: "name", type: "text", placeholder: "iPhone 15 Pro Max" },
                { label: "Brand", name: "brand", type: "text", placeholder: "Apple" },
              ].map((field) => (
                <label key={field.name} className={field.full ? "md:col-span-2" : ""}>
                  <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
                  <input
                    required
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={(changeEvent) => {
                      onChange(changeEvent);
                      setError("");
                    }}
                    placeholder={field.placeholder}
                    className="mm-input"
                  />
                </label>
              ))}

              <div>
                <span className="mb-1 block text-sm font-medium text-slate-700">Condition</span>
                <div className="flex items-center gap-3">
                  {conditionOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, type: opt.value }));
                        setError("");
                      }}
                      className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        form.type === opt.value
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-100 text-dark hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(changeEvent) => {
                    onChange(changeEvent);
                    setError("");
                  }}
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
                    <p className="text-sm text-slate-500">Add storage, color, and price variations.</p>
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
                      key={index}
                      className="relative grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3"
                    >
                      <div>
                        <span className="mb-1 block text-sm font-medium text-slate-700">Storage</span>
                        <CustomDropdown
                          value={variant.storage}
                          onChange={(value) => {
                            updateVariant(index, "storage", value);
                            setError("");
                          }}
                          options={storageOptions}
                        />
                      </div>

                      <label>
                        <span className="mb-1 block text-sm font-medium text-slate-700">Color</span>
                        <input
                          type="text"
                          placeholder="e.g., Space Black"
                          value={variant.color}
                          onChange={(changeEvent) => {
                            updateVariant(index, "color", changeEvent.target.value);
                            setError("");
                          }}
                          className="mm-input py-2.5"
                        />
                      </label>

                      <label>
                        <span className="mb-1 block text-sm font-medium text-slate-700">Price</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(changeEvent) => {
                            updateVariant(index, "price", changeEvent.target.value);
                            setError("");
                          }}
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

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">Product Images</p>
                  <p className="mb-4 text-sm text-slate-500">
                    Upload up to {MAX_IMAGES} images. Drag cards to set the carousel order. The first image becomes the main thumbnail.
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  {previewImages.length}/{MAX_IMAGES}
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onFilesSelected}
                disabled={isOptimizingImages || isSubmitting}
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={onDropZoneDragOver}
                onDragLeave={onDropZoneDragLeave}
                onDrop={onDropZoneDrop}
                className={`mb-4 flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-4 text-center transition ${
                  isDropZoneActive
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {isOptimizingImages ? (
                  <>
                    <Spinner size="sm" label="" className="mb-2 gap-2 text-emerald-600" />
                    <span className="font-medium">Optimizing selected images...</span>
                    <span className="text-sm">Please wait a moment</span>
                  </>
                ) : (
                  <>
                    <FiUpload className="mb-2 text-2xl" />
                    <span className="font-medium">Drag & drop images or click to upload</span>
                    <span className="text-sm">JPEG, PNG, WebP up to 5 MB each</span>
                  </>
                )}
              </div>

              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span>Drag image cards to reorder the frontend carousel.</span>
                {previewImages.length > 1 ? <span>Leftmost card is shown first.</span> : null}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <AnimatePresence>
                  {previewImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      layout
                      draggable={!isSubmitting && !isOptimizingImages}
                      onDragStart={() => onImageDragStart(image.id)}
                      onDragOver={(event) => onImageDragOver(event, image.id)}
                      onDragEnd={onImageDragEnd}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm transition ${
                        draggedImageId === image.id
                          ? "border-emerald-400 ring-2 ring-emerald-100"
                          : "border-slate-200"
                      }`}
                    >
                      <img
                        src={image.previewUrl}
                        alt={`Product preview ${index + 1}`}
                        className="h-28 w-full object-cover transition duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent px-2 py-2 text-[10px] text-white">
                        <p className="truncate font-medium">{image.originalName}</p>
                        <p>
                          {formatFileSize(image.originalSize)} to {formatFileSize(image.optimizedSize)}
                        </p>
                        <p>{image.reductionPercent}% smaller</p>
                      </div>
                      <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        #{index + 1}
                      </span>
                      {index === 0 ? (
                        <span className="absolute bottom-16 left-1.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          MAIN
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white"
                        aria-label={`Remove ${image.originalName}`}
                      >
                        <FiX className="text-xs" />
                      </button>

                      <div className="border-t border-slate-100 px-2 py-2">
                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-medium capitalize">{image.uploadStatus}</span>
                          <span>{image.uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              image.uploadStatus === "uploaded"
                                ? "bg-emerald-500"
                                : image.uploadStatus === "retrying"
                                  ? "bg-amber-400"
                                  : image.uploadStatus === "uploading"
                                    ? "bg-primary"
                                    : "bg-slate-200"
                            }`}
                            style={{ width: `${image.uploadProgress}%` }}
                          />
                        </div>
                        <p className="mt-1 min-h-4 text-[10px] text-slate-500">
                          {image.uploadError ||
                            (image.uploadStatus === "uploaded"
                              ? "Uploaded"
                              : image.uploadStatus === "uploading"
                                ? `Attempt ${Math.max(image.uploadAttempts, 1)}`
                                : image.uploadStatus === "ready"
                                  ? "Ready to upload"
                                  : "")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {Array.from({ length: Math.max(0, MAX_IMAGES - previewImages.length) }).map((_, index) => (
                  <button
                    key={`slot-${index}`}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isOptimizingImages || isSubmitting}
                    className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xl text-slate-400 transition hover:border-emerald-400 hover:text-emerald-500"
                  >
                    +
                  </button>
                ))}
              </div>

              {uploadedUrls.length > 0 ? (
                <p className="mt-3 text-xs text-slate-500">
                  {uploadedUrls.length} image{uploadedUrls.length > 1 ? "s" : ""} uploaded in carousel order.
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isOptimizingImages}
                className="ds-btn-primary w-auto px-8 py-3 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" label="" className="gap-2 text-white" />
                    <span>Uploading & Saving...</span>
                  </>
                ) : (
                  "Save Product"
                )}
              </motion.button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
