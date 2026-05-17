import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatINR } from "../../utils/currency";
import { getCloudinaryImageUrl } from "../../utils/cloudinaryImage";
import { buildProductInquiryMessage, buildWhatsAppHref } from "../../data/storeInfo";

function getProductSignals(product) {
  const variantCount = product.variants?.length ?? 0;
  if (product.type === "Used") {
    return { label: "Used", tone: "bg-white/95 text-slate-700" };
  }

  if (variantCount > 0 && variantCount <= 2) {
    return { label: `Only ${variantCount} left`, tone: "bg-amber-50 text-amber-800" };
  }

  return { label: "New", tone: "bg-emerald-50 text-emerald-800" };
}

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const productId = product._id || product.id;
  const firstVariant = product.variants?.[0];
  const previewImage = getCloudinaryImageUrl(
    (product.images && product.images[0]) || product.image,
    "product",
  );
  const displayPrice = firstVariant?.price ?? product.price ?? 0;
  const displayStorage = firstVariant?.storage || product.storage || "";
  const signal = getProductSignals(product);
  const whatsappLink = buildWhatsAppHref(
    buildProductInquiryMessage(product.name, [
      `Price: ${formatINR(displayPrice)}`,
      `Condition: ${product.type}`,
    ]),
  );

  const openWhatsApp = () => {
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group flex h-[380px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md sm:p-5">
      <button
        type="button"
        onClick={() => navigate(`/product/${productId}`)}
        className="relative block overflow-hidden rounded-xl bg-gray-100 text-left"
      >
        <div className="relative flex h-[140px] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100 min-[380px]:h-[160px] sm:h-[180px]">
          {!imageLoaded && !imageFailed ? (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100" />
          ) : null}

          {previewImage && !imageFailed ? (
            <img
              src={previewImage}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageFailed(true);
                setImageLoaded(false);
              }}
              className={`h-full w-full rounded-lg object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg px-4 text-center text-sm font-medium text-slate-400">
              No image available
            </div>
          )}
        </div>

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${signal.tone}`}
        >
          {signal.label}
        </span>
      </button>

      <div className="flex flex-1 flex-col pt-4">
        <div className="space-y-2">
          <h3 className="overflow-hidden text-base font-semibold leading-6 text-slate-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {product.name}
          </h3>

          <div className="space-y-1 text-sm text-slate-500">
            <p>{product.brand}</p>
            <p>{displayStorage || "Storage details available on product page"}</p>
          </div>

          <p className="pt-1 text-xl font-bold text-slate-900">{formatINR(displayPrice)}</p>
        </div>

        <div className="mt-auto flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/product/${productId}`)}
            className="ds-btn-secondary min-h-11 flex-1 px-4 py-2.5"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={openWhatsApp}
            className="ds-btn-primary min-h-11 flex-1 px-4 py-2.5 text-sm"
          >
            <FaWhatsapp className="text-lg" />
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
