import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { StorefrontProductsProvider } from "./storefront/StorefrontProductsProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StorefrontProductsProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            color: "#0f172a",
            boxShadow: "0 18px 50px rgba(15, 23, 42, 0.12)",
          },
        }}
      />
    </StorefrontProductsProvider>
  </BrowserRouter>
);
