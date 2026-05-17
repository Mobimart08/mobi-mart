import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { formatFileSize, optimizeImageFile } from "../../utils/imageUpload";
import {
  buildPreviewImage,
  createPreviewImagesFromUrls,
  getImageValidationError,
  getResetUploadState,
  MAX_PRODUCT_IMAGES,
  moveItem,
  revokePreviewImage,
} from "../utils/productImages";

export function useProductImages({ initialImages = [], setErrorMessage, setSuccessMessage } = {}) {
  const [previewImages, setPreviewImages] = useState(() => createPreviewImagesFromUrls(initialImages));
  const [isOptimizingImages, setIsOptimizingImages] = useState(false);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const fileInputRef = useRef(null);
  const previewImagesRef = useRef(previewImages);
  const hasHydratedInitialImagesRef = useRef(initialImages.length > 0);

  useEffect(() => {
    previewImagesRef.current = previewImages;
  }, [previewImages]);

  useEffect(() => {
    return () => {
      previewImagesRef.current.forEach(revokePreviewImage);
    };
  }, []);

  const clearFeedback = useCallback(() => {
    setErrorMessage?.("");
    setSuccessMessage?.("");
  }, [setErrorMessage, setSuccessMessage]);

  const hydrateFromUrls = useCallback((urls = []) => {
    if (hasHydratedInitialImagesRef.current || urls.length === 0) {
      return;
    }

    hasHydratedInitialImagesRef.current = true;
    setPreviewImages(createPreviewImagesFromUrls(urls));
  }, []);

  const updatePreviewImage = useCallback((imageId, updater) => {
    setPreviewImages((prev) =>
      prev.map((image) => (image.id === imageId ? { ...image, ...updater(image) } : image)),
    );
  }, []);

  const resetUploadStates = useCallback(() => {
    setPreviewImages((prev) => prev.map((image) => ({ ...image, ...getResetUploadState(image) })));
  }, []);

  const revokeAndRemovePreviewImage = useCallback((imageId) => {
    setPreviewImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === imageId);

      if (imageToRemove) {
        revokePreviewImage(imageToRemove);
      }

      return prev.filter((image) => image.id !== imageId);
    });
  }, []);

  const validateAndOptimizeImages = useCallback(
    async (incomingFiles) => {
      const files = Array.from(incomingFiles || []);

      if (files.length === 0) {
        return;
      }

      if (previewImagesRef.current.length + files.length > MAX_PRODUCT_IMAGES) {
        throw new Error(`You can upload a maximum of ${MAX_PRODUCT_IMAGES} images.`);
      }

      const invalidMessage = files.map(getImageValidationError).find(Boolean);

      if (invalidMessage) {
        throw new Error(invalidMessage);
      }

      setIsOptimizingImages(true);
      clearFeedback();

      try {
        const optimizedImages = await Promise.all(
          files.map(async (file) => buildPreviewImage(await optimizeImageFile(file))),
        );

        setPreviewImages((prev) => [...prev, ...optimizedImages]);
        setSuccessMessage?.(
          `${optimizedImages.length} image${optimizedImages.length > 1 ? "s are" : " is"} ready. Drag cards to control thumbnail order.`,
        );
        toast.success(
          `${optimizedImages.length} image${optimizedImages.length > 1 ? "s" : ""} added to the grid.`,
        );
      } finally {
        setIsOptimizingImages(false);
      }
    },
    [clearFeedback, setSuccessMessage],
  );

  const onFilesSelected = useCallback(
    async (event) => {
      try {
        await validateAndOptimizeImages(event.target.files);
      } catch (error) {
        const message = error.message || "Failed to optimize selected images.";
        setErrorMessage?.(message);
        toast.error(message);
      } finally {
        event.target.value = "";
      }
    },
    [setErrorMessage, validateAndOptimizeImages],
  );

  const onDropZoneDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDropZoneActive(true);
  }, []);

  const onDropZoneDragLeave = useCallback((event) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setIsDropZoneActive(false);
  }, []);

  const onDropZoneDrop = useCallback(
    async (event) => {
      event.preventDefault();
      setIsDropZoneActive(false);

      try {
        await validateAndOptimizeImages(event.dataTransfer.files);
      } catch (error) {
        const message = error.message || "Failed to process dropped images.";
        setErrorMessage?.(message);
        toast.error(message);
      }
    },
    [setErrorMessage, validateAndOptimizeImages],
  );

  const removeImage = useCallback(
    (imageId) => {
      clearFeedback();
      revokeAndRemovePreviewImage(imageId);
      toast.success("Image removed from the product.");
    },
    [clearFeedback, revokeAndRemovePreviewImage],
  );

  const onImageDragStart = useCallback((imageId) => {
    setDraggedImageId(imageId);
  }, []);

  const onImageDragOver = useCallback((event, targetImageId, isDisabled) => {
    event.preventDefault();

    if (!draggedImageId || draggedImageId === targetImageId || isDisabled) {
      return;
    }

    setPreviewImages((prev) => {
      const fromIndex = prev.findIndex((image) => image.id === draggedImageId);
      const toIndex = prev.findIndex((image) => image.id === targetImageId);
      return moveItem(prev, fromIndex, toIndex);
    });
  }, [draggedImageId]);

  const onImageDragEnd = useCallback(() => {
    setDraggedImageId(null);
  }, []);

  const editingImage = previewImages.find((image) => image.id === editingImageId) || null;

  const saveEditedImage = useCallback(
    (optimizedImage) => {
      if (!editingImageId) {
        return;
      }

      clearFeedback();
      setPreviewImages((prev) =>
        prev.map((image) => {
          if (image.id !== editingImageId) {
            return image;
          }

          revokePreviewImage(image);

          return {
            ...image,
            ...buildPreviewImage(optimizedImage, {
              id: image.id,
              remoteUrl: image.remoteUrl,
              source: image.remoteUrl ? "edited-remote" : "edited-local",
            }),
          };
        }),
      );
      setSuccessMessage?.("Edited image saved in the preview grid.");
      setEditingImageId(null);
    },
    [clearFeedback, editingImageId, setSuccessMessage],
  );

  return {
    previewImages,
    setPreviewImages,
    isOptimizingImages,
    resetUploadStates,
    updatePreviewImage,
    hydrateFromUrls,
    removePreviewImage: revokeAndRemovePreviewImage,
    imageManagerProps: {
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
      onRemoveImage: removeImage,
      onEditImage: setEditingImageId,
      onTriggerFilePicker: () => fileInputRef.current?.click(),
      formatFileSize,
    },
    imageEditorProps: {
      image: editingImage,
      isOpen: Boolean(editingImage),
      onClose: () => setEditingImageId(null),
      onSave: saveEditedImage,
    },
  };
}
