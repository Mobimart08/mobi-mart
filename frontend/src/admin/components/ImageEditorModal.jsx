import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-hot-toast";
import ModalShell from "../../components/ui/ModalShell";
import Spinner from "../../components/ui/Spinner";
import { optimizeImageFile } from "../../utils/imageUpload";

const aspectOptions = [
  { label: "Freeform", value: "freeform" },
  { label: "Original", value: "original" },
  { label: "Square", value: "1" },
  { label: "4:5", value: "0.8" },
  { label: "3:4", value: "0.75" },
  { label: "16:9", value: `${16 / 9}` },
];

function getTargetMimeType(image) {
  const type = image?.file?.type;

  if (type === "image/png" || type === "image/webp" || type === "image/jpeg") {
    return type;
  }

  return "image/webp";
}

function getEditedFileName(image, type) {
  const originalName = image?.originalName || "product-image";
  const baseName = originalName.replace(/\.[^.]+$/, "");
  const extension = type === "image/png" ? "png" : type === "image/jpeg" ? "jpg" : "webp";
  return `${baseName}-edited.${extension}`;
}

function blobFromCanvas(canvas, type, quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to render edited image."));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function ImageEditorBody({ image, onClose, onSave }) {
  const cropperRef = useRef(null);
  const previewTimeoutRef = useRef(null);
  const [aspectMode, setAspectMode] = useState("freeform");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(image.previewUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [originalAspect, setOriginalAspect] = useState(1);
  const targetMimeType = useMemo(() => getTargetMimeType(image), [image]);

  const schedulePreviewUpdate = useCallback(() => {
    window.clearTimeout(previewTimeoutRef.current);
    previewTimeoutRef.current = window.setTimeout(() => {
      const cropper = cropperRef.current?.cropper;

      if (!cropper) {
        return;
      }

      try {
        const canvas = cropper.getCroppedCanvas({
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        });

        if (canvas) {
          setPreviewUrl(canvas.toDataURL(targetMimeType, 0.9));
        }
      } catch {
        setPreviewUrl(image.previewUrl);
      }
    }, 100);
  }, [image.previewUrl, targetMimeType]);

  useEffect(() => {
    return () => {
      window.clearTimeout(previewTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    if (aspectMode === "freeform") {
      cropper.setAspectRatio(NaN);
    } else if (aspectMode === "original") {
      cropper.setAspectRatio(originalAspect || NaN);
    } else {
      cropper.setAspectRatio(Number(aspectMode) || NaN);
    }

    schedulePreviewUpdate();
  }, [aspectMode, originalAspect, schedulePreviewUpdate]);

  const handleReset = () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    cropper.reset();
    cropper.rotateTo(0);
    cropper.zoomTo(1);
    setAspectMode("freeform");
    setZoom(1);
    setRotation(0);
    setPreviewUrl(image.previewUrl);
    schedulePreviewUpdate();
  };

  const handleSave = async () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) {
      return;
    }

    try {
      setIsSaving(true);

      const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!canvas) {
        throw new Error("Unable to capture the cropped image.");
      }

      const blob = await blobFromCanvas(canvas, targetMimeType, 0.92);
      const editedFile = new File([blob], getEditedFileName(image, targetMimeType), {
        type: targetMimeType,
        lastModified: Date.now(),
      });
      const optimizedImage = await optimizeImageFile(editedFile);
      onSave(optimizedImage);
      toast.success("Image updated in preview.");
    } catch (error) {
      toast.error(error.message || "Unable to save the edited image.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalShell
      isOpen
      onClose={isSaving ? () => {} : onClose}
      title="Edit Product Image"
      description="Drag the crop box with your mouse. Pull side handles for one-direction resizing, bottom/top for height, and corners for both width and height."
      widthClassName="max-w-6xl"
      footer={(
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="ds-btn border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            <FiRefreshCcw />
            Reset
          </button>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="ds-btn border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="ds-btn-primary"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" label="" className="gap-2 text-white" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                "Save Edited Image"
              )}
            </button>
          </div>
        </div>
      )}
    >
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950/95">
          <div className="relative h-[340px] w-full bg-slate-950 sm:h-[460px]">
            <Cropper
              ref={cropperRef}
              src={image.previewUrl}
              style={{ height: "100%", width: "100%" }}
              viewMode={1}
              dragMode="move"
              aspectRatio={originalAspect}
              background={false}
              responsive
              autoCrop
              autoCropArea={0.9}
              guides
              center
              highlight
              cropBoxMovable
              cropBoxResizable
              toggleDragModeOnDblclick={false}
              movable
              zoomable
              rotatable
              scalable={false}
              minCropBoxWidth={80}
              minCropBoxHeight={80}
              ready={(event) => {
                const cropper = event.currentTarget.cropper;
                const imageData = cropper.getImageData();

                if (imageData.naturalWidth && imageData.naturalHeight) {
                  const ratio = imageData.naturalWidth / imageData.naturalHeight;
                  setOriginalAspect(ratio);
                  cropper.setAspectRatio(NaN);
                }

                schedulePreviewUpdate();
              }}
              crop={schedulePreviewUpdate}
              cropmove={schedulePreviewUpdate}
              zoom={(event) => {
                const cropper = cropperRef.current?.cropper;

                if (!cropper) {
                  return;
                }

                const imageData = cropper.getImageData();
                if (imageData.naturalWidth > 0) {
                  setZoom(Number((imageData.width / imageData.naturalWidth).toFixed(2)));
                }

                schedulePreviewUpdate();
                return event;
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Live Preview</p>
            <p className="mt-1 text-xs text-slate-500">
              In freeform mode, side handles resize one direction and corner handles resize both directions.
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={previewUrl} alt="Edited preview" className="h-56 w-full object-cover" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Crop Mode</span>
              <select
                value={aspectMode}
                onChange={(event) => setAspectMode(event.target.value)}
                className="ds-select"
                disabled={isSaving}
              >
                {aspectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>Zoom</span>
                <span>{zoom.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={Math.min(3, Math.max(0.5, zoom))}
                onChange={(event) => {
                  const nextZoom = Number(event.target.value);
                  const cropper = cropperRef.current?.cropper;

                  if (!cropper) {
                    return;
                  }

                  cropper.zoomTo(nextZoom);
                  setZoom(nextZoom);
                  schedulePreviewUpdate();
                }}
                disabled={isSaving}
              />
            </label>

            <label className="mt-4 block">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>Rotate</span>
                <span>{rotation}&deg;</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(event) => {
                  const nextRotation = Number(event.target.value);
                  const cropper = cropperRef.current?.cropper;

                  if (!cropper) {
                    return;
                  }

                  cropper.rotateTo(nextRotation);
                  setRotation(nextRotation);
                  schedulePreviewUpdate();
                }}
                disabled={isSaving}
              />
            </label>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

export default function ImageEditorModal({ image, isOpen, onClose, onSave }) {
  if (!isOpen || !image) {
    return null;
  }

  return <ImageEditorBody key={image.id} image={image} onClose={onClose} onSave={onSave} />;
}
