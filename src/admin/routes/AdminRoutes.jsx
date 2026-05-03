import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { AdminAuthProvider } from "../context/AdminAuthContext";
import { ProductProvider } from "../context/ProductContext";
import { useAdminAuth } from "../context/useAdminAuth";
import AddProduct from "../pages/AddProduct";
import Dashboard from "../pages/Dashboard";
import EditProduct from "../pages/EditProduct";
import Login from "../pages/Login";
import Products from "../pages/Products";

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AdminIndexRedirect() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Navigate
      to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
      replace
    />
  );
}

function AdminRouteTree() {
  const location = useLocation();

  return (
    <ProductProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<AdminIndexRedirect />} />
          <Route
            path="login"
            element={(
              <AnimatedPage>
                <Login />
              </AnimatedPage>
            )}
          />
          <Route
            path="dashboard"
            element={(
              <ProtectedRoute>
                <AnimatedPage>
                  <Dashboard />
                </AnimatedPage>
              </ProtectedRoute>
            )}
          />
          <Route
            path="products"
            element={(
              <ProtectedRoute>
                <AnimatedPage>
                  <Products />
                </AnimatedPage>
              </ProtectedRoute>
            )}
          />
          <Route
            path="add-product"
            element={(
              <ProtectedRoute>
                <AnimatedPage>
                  <AddProduct />
                </AnimatedPage>
              </ProtectedRoute>
            )}
          />
          <Route
            path="edit-product/:id"
            element={(
              <ProtectedRoute>
                <AnimatedPage>
                  <EditProduct />
                </AnimatedPage>
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </AnimatePresence>
    </ProductProvider>
  );
}

export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <AdminRouteTree />
    </AdminAuthProvider>
  );
}
