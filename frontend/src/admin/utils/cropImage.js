function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image for editing."));
    image.src = url;
  });
}

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function renderCroppedCanvas(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image editing is not supported in this browser.");
  }

  const safeArea = rotateSize(image.width, image.height, rotation);
  canvas.width = safeArea.width;
  canvas.height = safeArea.height;

  context.translate(safeArea.width / 2, safeArea.height / 2);
  context.rotate(getRadianAngle(rotation));
  context.translate(-image.width / 2, -image.height / 2);
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    Math.round(pixelCrop.width),
    Math.round(pixelCrop.height),
  );

  const croppedCanvas = document.createElement("canvas");
  const croppedContext = croppedCanvas.getContext("2d");

  if (!croppedContext) {
    throw new Error("Image editing is not supported in this browser.");
  }

  croppedCanvas.width = Math.round(pixelCrop.width);
  croppedCanvas.height = Math.round(pixelCrop.height);
  croppedContext.putImageData(imageData, 0, 0);

  return croppedCanvas;
}

function canvasToBlob(canvas, type, quality = 0.92) {
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

export async function getEditedImagePreviewUrl(imageSrc, pixelCrop, rotation = 0, type = "image/webp") {
  const croppedCanvas = await renderCroppedCanvas(imageSrc, pixelCrop, rotation);
  return croppedCanvas.toDataURL(type, 0.9);
}

export async function getEditedImageFile(
  imageSrc,
  pixelCrop,
  rotation = 0,
  {
    fileName = `edited-${Date.now()}.webp`,
    type = "image/webp",
    quality = 0.92,
  } = {},
) {
  const croppedCanvas = await renderCroppedCanvas(imageSrc, pixelCrop, rotation);
  const blob = await canvasToBlob(croppedCanvas, type, quality);

  return new File([blob], fileName, {
    type,
    lastModified: Date.now(),
  });
}
