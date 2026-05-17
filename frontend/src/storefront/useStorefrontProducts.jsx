import { useContext } from "react";
import StorefrontProductsContext from "./storefrontProductsContext";

export function useStorefrontProducts() {
  const context = useContext(StorefrontProductsContext);

  if (!context) {
    throw new Error("useStorefrontProducts must be used within StorefrontProductsProvider.");
  }

  return context;
}
