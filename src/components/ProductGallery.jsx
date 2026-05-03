import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCloudinaryImageUrl } from "../utils/cloudinaryImage";

export default function ProductGallery({
  images,
  selectedImage,
  onSelectImage,
  productName,
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const currentIndex = images.findIndex((img) => img === selectedImage);

  const goToNextImage = () => {
    const next = (currentIndex + 1) % images.length;
    onSelectImage(images[next]);
  };

  const goToPrevImage = () => {
    const prev = (currentIndex - 1 + images.length) % images.length;
    onSelectImage(images[prev]);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      goToNextImage();
    } else if (distance < -minSwipeDistance) {
      goToPrevImage();
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-[520px]">
      <div className="flex md:flex-col gap-3 overflow-x-auto shrink-0">
        {images.map((img, i) => (
          <img
            key={i}
            src={getCloudinaryImageUrl(img, "thumbnail")}
            alt={`${productName} thumbnail ${i + 1}`}
            onClick={() => onSelectImage(img)}
            className={`h-16 w-16 shrink-0 cursor-pointer rounded-lg border object-cover transition ${
              selectedImage === img ? "border-primary" : "border-gray-200"
            }`}
          />
        ))}
      </div>

      <div
        className="relative flex flex-1 items-center justify-center rounded-2xl bg-white p-4 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={getCloudinaryImageUrl(selectedImage, "hero")}
            alt={productName}
            initial={{ opacity: 0.4, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="max-h-[420px] w-full object-contain object-center transition duration-300 hover:scale-105"
          />
        </AnimatePresence>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 z-10">
          {images.map((_, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onSelectImage(images[i]);
              }}
              className={`h-2 w-2 cursor-pointer rounded-full transition ${
                images[i] === selectedImage
                  ? "scale-110 bg-primary"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
