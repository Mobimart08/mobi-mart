import { useCallback, useEffect, useMemo, useState } from "react";
import ProductContext from "./ProductContextValue";
import {
  addProduct as createProduct,
  deleteProduct as removeProduct,
  getProducts,
  updateProduct as saveProduct,
} from "../../services/productAPI";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError("");
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load products.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshProducts();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [refreshProducts]);

  const addProduct = async (product) => {
    const createdProduct = await createProduct(product);
    setProducts((prev) => [createdProduct, ...prev]);
    return createdProduct;
  };

  const deleteProduct = async (id) => {
    await removeProduct(id);
    setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  const updateProduct = async (id, payload) => {
    const updatedProduct = await saveProduct(id, payload);
    setProducts((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id
          ? updatedProduct
          : item,
      ),
    );
    return updatedProduct;
  };

  const value = useMemo(
    () => ({
      products,
      isLoading,
      error,
      addProduct,
      deleteProduct,
      updateProduct,
      refreshProducts,
    }),
    [products, isLoading, error, refreshProducts],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
