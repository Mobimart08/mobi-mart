import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/productAPI";
import StorefrontProductsContext from "./storefrontProductsContext";

const PRODUCT_CACHE_KEY = "mobiMart.products.cache.v1";
const SPLASH_FALLBACK_MS = 2500;

function readCachedProducts() {
  try {
    const rawValue = localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeCachedProducts(products) {
  try {
    localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(products));
  } catch {
    // Ignore storage write failures so the live experience still works.
  }
}

export function StorefrontProductsProvider({ children }) {
  const initialCachedProducts = readCachedProducts();
  const [products, setProducts] = useState(() => initialCachedProducts);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(() => initialCachedProducts.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(() => initialCachedProducts.length === 0);

  const hideSplash = useCallback(() => {
    setIsSplashVisible(false);
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await getProducts();
      setProducts(data);
      setError("");
      writeCachedProducts(data);
      hideSplash();
      return data;
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load products right now.");
      hideSplash();
      throw fetchError;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [hideSplash]);

  useEffect(() => {
    const splashFallbackTimer = window.setTimeout(() => {
      hideSplash();
    }, SPLASH_FALLBACK_MS);

    queueMicrotask(() => {
      refreshProducts().catch(() => {});
    });

    return () => {
      window.clearTimeout(splashFallbackTimer);
    };
  }, [hideSplash, refreshProducts]);

  const value = useMemo(
    () => ({
      products,
      error,
      isLoading,
      isRefreshing,
      isSplashVisible,
      refreshProducts,
    }),
    [products, error, isLoading, isRefreshing, isSplashVisible, refreshProducts],
  );

  return <StorefrontProductsContext.Provider value={value}>{children}</StorefrontProductsContext.Provider>;
}
