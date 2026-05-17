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

      <div className="order-1 overflow-hidden rounded-2xl border border-primary/20 bg-cream p-4 shadow-md sm:order-2 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={getCloudinaryImageUrl(selectedImage, "hero")}
            alt={productName}
            loading="eager"
            decoding="async"
            initial={{ opacity: 0.4, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="mx-auto h-[320px] w-full max-w-[460px] object-contain sm:h-[420px] sm:max-w-[560px] lg:h-[520px] lg:max-w-[640px]"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
