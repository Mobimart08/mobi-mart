import ProductCard from "../ui/ProductCard";
import StatusMessage from "../ui/StatusMessage";
import { buildWhatsAppHref } from "../../data/storeInfo";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";

const Featured = ({ products, error, isLoading }) => {
  const featuredEmptyWhatsappHref = buildWhatsAppHref(
    "Hi, I want to know which phones are currently available in your store.",
  );

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-semibold text-dark md:text-4xl">
            Featured Phones
          </h2>

          <span className="text-sm font-medium text-slate-500">
            Fresh picks from our latest inventory
          </span>
        </div>

        <StatusMessage message={error} tone="error" className="mb-5" />

        {isLoading && products.length === 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : !error && products.length === 0 ? (
          <div className="mm-empty-state">
            <h3 className="text-lg font-semibold text-slate-900">
              Didn&apos;t find what you&apos;re looking for?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Chat with us on WhatsApp and we&apos;ll suggest phones from our latest stock.
            </p>
            <a
              href={featuredEmptyWhatsappHref}
              target="_blank"
              rel="noreferrer"
              className="ds-btn-primary mt-5"
            >
              Chat on WhatsApp
            </a>
          </div>
        ) : (
          <div className="mm-fade-in-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Featured;
