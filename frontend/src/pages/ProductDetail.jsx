import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaShieldAlt, FaStore, FaWhatsapp } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import ProductGallery from "../components/ProductGallery";
import RelatedProducts from "../components/RelatedProducts";
import Spinner from "../components/ui/Spinner";
import StatusMessage from "../components/ui/StatusMessage";
import {
  buildProductInquiryMessage,
  buildWhatsAppHref,
  googleMapsHref,
  storeAddressLines,
} from "../data/storeInfo";
import { formatINR } from "../utils/currency";
import { getProductById } from "../services/productAPI";
import { useStorefrontProducts } from "../storefront/useStorefrontProducts";

const buyingReasons = [
  { icon: FiCheckCircle, title: "Tested Devices", text: "Every phone is checked before it reaches you." },
  { icon: FaShieldAlt, title: "Best Price Guarantee", text: "Transparent pricing with value-first recommendations." },
  { icon: FaStore, title: "Trusted Local Seller", text: "Visit the store anytime for in-person guidance and support." },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { products: storefrontProducts } = useStorefrontProducts();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageOverride, setSelectedImageOverride] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProductPage = async () => {
      try {
        setIsLoading(true);
        setError("");
        const productData = await getProductById(id);

        if (!isMounted) {
          return;
        }

        setProduct(productData);
        setSelectedStorage(productData.variants?.[0]?.storage ?? null);
        setSelectedColor(productData.variants?.[0]?.color ?? null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError.response?.data?.message || "Unable to load product details.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProductPage();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const recommendedProducts = useMemo(() => {
    return storefrontProducts
      .filter((item) => String(item._id || item.id) !== String(id))
      .slice(0, 4);
  }, [id, storefrontProducts]);

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product]);

  const selectedImage =
    selectedImageOverride && images.includes(selectedImageOverride)
      ? selectedImageOverride
      : (images[0] ?? null);

  const storages = product?.variants
    ? [...new Set(product.variants.map((variant) => variant.storage))]
    : [];

  const colors = product?.variants
    ? [
        ...new Set(
          product.variants
            .filter((variant) => variant.storage === selectedStorage)
            .map((variant) => variant.color),
        ),
      ]
    : [];

  const selectedVariant = product?.variants
    ? product.variants.find(
        (variant) => variant.storage === selectedStorage && variant.color === selectedColor,
      )
    : null;

  const displayPrice = selectedVariant?.price ?? product?.variants?.[0]?.price ?? 0;
  const whatsappLink = product
    ? buildWhatsAppHref(
        buildProductInquiryMessage(product.name, [
          `Price: ${formatINR(displayPrice)}`,
          `Condition: ${product.type}`,
          selectedStorage ? `Storage: ${selectedStorage}` : "",
          selectedColor ? `Color: ${selectedColor}` : "",
        ]),
      )
    : "";

  if (isLoading) {
    return (
      <div className="pb-16 pt-20 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 shadow-sm">
            <Spinner label="Loading product details..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pb-16 pt-20 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-dark sm:text-3xl">Product Not Found</h1>
          <StatusMessage
            message={error || "We couldn't find the product you were looking for."}
            tone="error"
            className="mx-auto mt-4 max-w-xl text-left"
          />
          <Link
            to="/shop"
            className="ds-btn-primary mt-6"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-20 sm:pb-24 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:text-sm">
          <Link to="/shop" className="hover:text-primary">
            Store
          </Link>
          <span>/</span>
          <span>{product.brand}</span>
          <span>/</span>
          <span className="font-medium text-dark">{product.name}</span>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-6 rounded-2xl border border-primary/15 bg-white p-4 shadow-md lg:grid-cols-[1.2fr_1fr] lg:gap-8 lg:p-6"
        >
          <ProductGallery
            images={images}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImageOverride}
            productName={product.name}
          />

          <div>
            <h1 className="text-2xl font-semibold text-dark sm:text-3xl lg:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-gray-600">{product.brand}</p>

            <div className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-dark shadow-sm">
              {product.type}
            </div>

            <p className="mt-5 text-3xl font-bold text-dark sm:text-4xl lg:text-5xl">{formatINR(displayPrice)}</p>

            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              {product.description || "No description available for this product yet."}
            </p>

            {storages.length > 0 ? (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-dark">Storage</p>
                <div className="flex flex-wrap gap-2">
                  {storages.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedStorage(size);
                        const nextColors = product.variants
                          .filter((variant) => variant.storage === size)
                          .map((variant) => variant.color);

                        if (!nextColors.includes(selectedColor) && nextColors.length > 0) {
                          setSelectedColor(nextColors[0]);
                        }
                      }}
                      className={`rounded-xl border px-4 py-2 text-sm transition ${
                        selectedStorage === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-primary/20 text-gray-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {colors.length > 0 ? (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-dark">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-xl border px-4 py-2 text-sm transition ${
                        selectedColor === color
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-primary/20 text-gray-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-7 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => window.open(whatsappLink, "_blank", "noopener,noreferrer")}
                className="ds-btn-primary w-full px-4 py-3 shadow-md"
              >
                <FaWhatsapp aria-hidden="true" />
                Enquire on WhatsApp
              </motion.button>

              <a
                href={googleMapsHref}
                target="_blank"
                rel="noreferrer"
                className="ds-btn-secondary w-full px-4 py-3"
              >
                <FaMapMarkerAlt aria-hidden="true" />
                Get Store Location
              </a>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">Store Address</p>
              <div className="mt-2 space-y-1 text-sm text-slate-600">
                {storeAddressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/[0.03] p-4">
              <h2 className="text-base font-semibold text-dark">Why buy from us?</h2>
              <div className="mt-4 space-y-3">
                {buyingReasons.map((reason) => {
                  const Icon = reason.icon;
                  return (
                    <div key={reason.title} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-9 place-items-center rounded-full bg-white text-primary shadow-sm">
                        <Icon aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{reason.title}</p>
                        <p className="text-sm text-slate-600">{reason.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        <RelatedProducts products={recommendedProducts} currentId={product._id || product.id} />
      </div>
    </div>
  );
}
