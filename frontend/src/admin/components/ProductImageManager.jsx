import { AnimatePresence, motion } from "framer-motion";
import { FiEdit3, FiImage, FiTrash2, FiUpload } from "react-icons/fi";
import Spinner from "../../components/ui/Spinner";
import { MAX_PRODUCT_IMAGES } from "../utils/productImages";

function getStatusColor(uploadStatus) {
  if (uploadStatus === "uploaded") {
    return "bg-emerald-500";
  }

  if (uploadStatus === "retrying") {
    return "bg-amber-400";
  }

  if (uploadStatus === "uploading") {
    return "bg-primary";
  }

  return "bg-slate-200";
}

export default function ProductImageManager({
  previewImages,
  isOptimizingImages,
  isDropZoneActive,
  draggedImageId,
  fileInputRef,
  onFilesSelected,
  onDropZoneDragOver,
  onDropZoneDragLeave,
  onDropZoneDrop,
  onImageDragStart,
  onImageDragOver,
  onImageDragEnd,
  onRemoveImage,
  onEditImage,
  onTriggerFilePicker,
  formatFileSize,
  isSubmitting = false,
  uploadedUrlsCount = 0,
}) {
  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">Product Images</p>
            <p className="mb-4 text-sm text-slate-500">
              Upload up to {MAX_PRODUCT_IMAGES} JPG, PNG, or WEBP images. Reorder cards to control the product thumbnail and storefront carousel.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            {previewImages.length}/{MAX_PRODUCT_IMAGES}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={onFilesSelected}
          disabled={isOptimizingImages || isSubmitting}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={onTriggerFilePicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onTriggerFilePicker();
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
              <span className="font-medium">Preparing product images...</span>
              <span className="text-sm">We are optimizing them for a smoother upload</span>
            </>
          ) : (
            <>
              <FiUpload className="mb-2 text-2xl" />
              <span className="font-medium">Drag & drop images or click to upload</span>
              <span className="text-sm">JPG, PNG, WEBP up to 5 MB each</span>
            </>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>Use the edit button on each card to crop, zoom, rotate, and save before submitting.</span>
          {previewImages.length > 1 ? <span>First card becomes the storefront thumbnail.</span> : null}
        </div>

        {previewImages.length === 0 ? (
          <div className="mm-empty-state">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
              <FiImage className="text-2xl" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-900">No product images yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add up to six images and put your best product shot first.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <AnimatePresence>
              {previewImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  draggable={!isSubmitting && !isOptimizingImages}
                  onDragStart={() => onImageDragStart(image.id)}
                  onDragOver={(event) => onImageDragOver(event, image.id, isSubmitting || isOptimizingImages)}
                  onDragEnd={onImageDragEnd}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
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
                      {image.optimizedSize > 0 ? (
                        <>
                          {formatFileSize(image.originalSize)} to {formatFileSize(image.optimizedSize)}
                        </>
                      ) : (
                        "Existing image ready"
                      )}
                    </p>
                    <p>
                      {image.optimizedSize > 0 ? `${image.reductionPercent}% smaller` : "No re-upload needed"}
                    </p>
                  </div>
                  <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    #{index + 1}
                  </span>
                  {index === 0 ? (
                    <span className="absolute bottom-16 left-1.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      THUMBNAIL
                    </span>
                  ) : null}

                  <div className="absolute right-1.5 top-1.5 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditImage(image.id)}
                      className="rounded-full bg-white/95 p-2 text-slate-700 shadow-sm transition hover:bg-white hover:text-primary"
                      aria-label={`Edit ${image.originalName}`}
                      title="Edit image"
                    >
                      <FiEdit3 className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(image.id)}
                      className="rounded-full bg-black/65 p-2 text-white transition hover:bg-rose-600"
                      aria-label={`Remove ${image.originalName}`}
                      title="Remove image"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>

                  <div className="border-t border-slate-100 px-2 py-2">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium capitalize">{image.uploadStatus}</span>
                      <span>{image.uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getStatusColor(image.uploadStatus)}`}
                        style={{ width: `${image.uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-1 min-h-4 text-[10px] text-slate-500">
                      {image.uploadError ||
                        (image.uploadStatus === "uploaded"
                          ? image.file
                            ? "Uploaded"
                            : "Ready without re-upload"
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

            {Array.from({ length: Math.max(0, MAX_PRODUCT_IMAGES - previewImages.length) }).map((_, index) => (
              <button
                key={`slot-${index}`}
                type="button"
                onClick={onTriggerFilePicker}
                disabled={isOptimizingImages || isSubmitting}
                className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-xl text-slate-400 transition hover:border-emerald-400 hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Add another product image"
              >
                +
              </button>
            ))}
          </div>
        )}

        {uploadedUrlsCount > 0 ? (
          <p className="mt-3 text-xs text-slate-500">
            {uploadedUrlsCount} image{uploadedUrlsCount > 1 ? "s" : ""} synced in the current gallery order.
          </p>
        ) : null}
      </div>
    </>
  );
}
