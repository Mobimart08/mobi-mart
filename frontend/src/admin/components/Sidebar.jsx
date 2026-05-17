import { motion } from "framer-motion";
import { FiBox, FiGrid, FiLogOut, FiPlusCircle } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/useAdminAuth";

const menuItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/add-product", label: "Add Product", icon: FiPlusCircle },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  return (
    <aside className="flex w-full flex-col bg-primary px-5 py-7 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-[260px] lg:overflow-y-auto">
      <div>
        <h2 className="text-3xl font-semibold leading-none">
          Mobi <span className="text-yellow">Mart</span>
        </h2>
        <p className="mt-1 text-sm text-white/70">Admin Panel</p>
      </div>

      <nav className="mt-10 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ y: -1 }}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                    isActive
                      ? "border-l-4 border-yellow bg-white/10 text-white"
                      : "rounded-xl text-white/80 hover:bg-white/5"
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          logout();
          navigate("/admin/login");
        }}
        className="mb-2 mt-auto flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/5"
      >
        <FiLogOut className="text-lg" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
}
