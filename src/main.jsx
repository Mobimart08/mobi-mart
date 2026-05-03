import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { StorefrontProductsProvider } from "./storefront/StorefrontProductsProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StorefrontProductsProvider>
      <App />
    </StorefrontProductsProvider>
  </BrowserRouter>
);
