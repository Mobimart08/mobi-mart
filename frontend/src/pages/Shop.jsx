import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiSliders } from "react-icons/fi";
import Filters from "../components/shop/Filters";
import ProductGrid from "../components/shop/ProductGrid";
import StatusMessage from "../components/ui/StatusMessage";
import { buildWhatsAppHref } from "../data/storeInfo";
import { formatINR } from "../utils/currency";
import { useStorefrontProducts } from "../storefront/useStorefrontProducts";

function getLowestPrice(product) {
  if (!Array.isArray(product.variants) || product.variants.length === 0) {
    return Number(product.price || 0);
  }

  return (
    product.variants.reduce((lowest, variant) => {
      const variantPrice = Number(variant.price || 0);
      return lowest === null || variantPrice < lowest ? variantPrice : lowest;
    }, null) ?? 0
  );
}

const sheetBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const sheetPanel = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

const defaultFilters = {
  search: "",
  brand: "All",
  condition: "All",
  minPrice: "",
  maxPrice: "",
};

const Shop = () => {
  const { products, error, isLoading } = useStorefrontProducts();
  const [filters, setFilters] = useState(defaultFilters);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const emptyStateWhatsappHref = buildWhatsAppHref(
    "Hi, I could not find the phone I was looking for on the website. Can you help me?",
  );

  useEffect(() => {
    if (!isMobileFiltersOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileFiltersOpen]);

  const brandOptions = useMemo(() => {
    const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))];
    return [
      { label: "All Brands", value: "All" },
      ...brands.map((item) => ({ label: item, value: item })),
    ];
  }, [products]);

  const conditionOptions = [
    { label: "All Conditions", value: "All" },
    { label: "New", value: "New" },
    { label: "Used", value: "Used" },
  ];

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    const parsedMinPrice = filters.minPrice === "" ? null : Number(filters.minPrice);
    const parsedMaxPrice = filters.maxPrice === "" ? null : Number(filters.maxPrice);

    return products.filter((product) => {
      const lowestPrice = getLowestPrice(product);
      const matchesSearch =
        !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch);
      const matchesBrand = filters.brand === "All" || product.brand === filters.brand;
      const matchesCondition =
        filters.condition === "All" || product.type === filters.condition;
      const matchesMinPrice = parsedMinPrice === null || lowestPrice >= parsedMinPrice;
      const matchesMaxPrice = parsedMaxPrice === null || lowestPrice <= parsedMaxPrice;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCondition &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [products, filters]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.brand !== defaultFilters.brand,
      filters.condition !== defaultFilters.condition,
      filters.minPrice !== defaultFilters.minPrice,
      filters.maxPrice !== defaultFilters.maxPrice,
    ].filter(Boolean).length;
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const closeMobileFilters = () => {
    setIsMobileFiltersOpen(false);
  };

  return (
    <div className="min-h-screen pb-24 pt-24 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-semibold text-dark sm:text-4xl">Browse Phones</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Find the perfect phone for you.
          </p>
        </div>

        <div className="mb-6 rounded-[26px] border border-slate-200/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur sm:p-4 lg:hidden">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label className="sr-only" htmlFor="mobile-shop-search">
                Search
              </label>
              <input
                id="mobile-shop-search"
                type="text"
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Search by product name"
                className="mm-input"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-white sm:min-w-[160px]"
            >
              <FiSliders />
              Filters
              {activeFiltersCount > 0 ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-900">
                  {activeFiltersCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Filters
                brand={filters.brand}
                setBrand={(value) => updateFilter("brand", value)}
                brandOptions={brandOptions}
                condition={filters.condition}
                setCondition={(value) => updateFilter("condition", value)}
                conditionOptions={conditionOptions}
                minPrice={filters.minPrice}
                setMinPrice={(value) => updateFilter("minPrice", value)}
                maxPrice={filters.maxPrice}
                setMaxPrice={(value) => updateFilter("maxPrice", value)}
                resetFilters={resetFilters}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 rounded-[26px] border border-slate-200/80 bg-white/85 p-4 shadow-[0_16px_38px_rgba(15,23,42,0.06)] backdrop-blur sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1">
                  <label className="mb-2 hidden text-sm font-medium text-slate-800 lg:block">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(event) => updateFilter("search", event.target.value)}
                    placeholder="Search by product name"
                    className="mm-input hidden lg:block"
                  />
                  <p className="text-sm text-gray-600 lg:mt-3">
                    {filteredProducts.length} products found
                    {filters.minPrice || filters.maxPrice
                      ? ` - Price ${formatINR(filters.minPrice || 0)} to ${
                          filters.maxPrice ? formatINR(filters.maxPrice) : "Any"
                        }`
                      : ""}
                  </p>
                </div>

                {activeFiltersCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="hidden min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 lg:inline-flex"
                  >
                    Reset Filters
                  </button>
                ) : null}
              </div>
            </div>

            <StatusMessage message={error} tone="error" className="mb-4" />

            {isLoading && products.length === 0 ? (
              <ProductGrid products={products} isLoading skeletonCount={6} />
            ) : filteredProducts.length === 0 ? (
              <div className="mm-empty-state">
                <h2 className="text-xl font-semibold text-slate-900">Didn&apos;t find what you&apos;re looking for?</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Chat with us on WhatsApp and we&apos;ll help you find the right phone quickly.
                </p>
                <a
                  href={emptyStateWhatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-btn-primary mt-5"
                >
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileFiltersOpen ? (
          <motion.div
            variants={sheetBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[70] bg-slate-950/35 px-3 pb-3 pt-16 lg:hidden"
            onClick={closeMobileFilters}
          >
            <div className="flex h-full items-end">
              <motion.div
                variants={sheetPanel}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="max-h-[88vh] w-full overflow-y-auto rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,249,0.96))] p-4 shadow-[0_30px_60px_rgba(15,23,42,0.20)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-300" />
                <Filters
                  brand={filters.brand}
                  setBrand={(value) => updateFilter("brand", value)}
                  brandOptions={brandOptions}
                  condition={filters.condition}
                  setCondition={(value) => updateFilter("condition", value)}
                  conditionOptions={conditionOptions}
                  minPrice={filters.minPrice}
                  setMinPrice={(value) => updateFilter("minPrice", value)}
                  maxPrice={filters.maxPrice}
                  setMaxPrice={(value) => updateFilter("maxPrice", value)}
                  resetFilters={resetFilters}
                  onApply={closeMobileFilters}
                  showActions
                  className="border-0 bg-transparent p-1 shadow-none"
                />
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
