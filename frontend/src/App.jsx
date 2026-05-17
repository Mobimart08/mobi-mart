import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import AdminRoutes from "./admin/routes/AdminRoutes";
import ProductDetail from "./pages/ProductDetail";
import AppSplash from "./components/ui/AppSplash";
import { useStorefrontProducts } from "./storefront/useStorefrontProducts";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function App() {
  const { isSplashVisible } = useStorefrontProducts();

  return (
    <>
      <ScrollToTop />
      <AppSplash visible={isSplashVisible} />

      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/shop"
          element={
            <MainLayout>
              <Shop />
            </MainLayout>
          }
        />

        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />

        <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          }
        />

        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

export default App;
