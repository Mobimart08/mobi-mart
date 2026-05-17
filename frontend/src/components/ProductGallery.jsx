import { AnimatePresence, motion } from "framer-motion";
import { getCloudinaryImageUrl } from "../utils/cloudinaryImage";

export default function ProductGallery({
  images,
  selectedImage,
  onSelectImage,
  productName,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
        {images.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => onSelectImage(image)}
            className={`shrink-0 overflow-hidden rounded-xl border p-1 transition ${
              selectedImage === image
                ? "border-primary bg-primary/10"
                : "border-primary/20 bg-white"
            }`}
          >
            <img
              src={getCloudinaryImageUrl(image, "thumbnail")}
              alt={productName}
              loading="lazy"
              decoding="async"
              className="h-16 w-16 rounded-lg object-cover"
            />
          </button>
        ))}
      </div>

      <div className="order-1 overflow-hidden rounded-2xl border border-primary/20 bg-cream p-3 shadow-md sm:order-2 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0.4, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-primary/10 bg-white/70 p-4 sm:min-h-[420px] sm:p-6 lg:min-h-[520px]"
          >
            <img
              src={getCloudinaryImageUrl(selectedImage, "hero")}
              alt={productName}
              loading="eager"
              decoding="async"
              className="h-full max-h-[500px] w-full object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
