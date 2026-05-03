import { useMemo } from "react";
import { motion } from "framer-motion";
import { FiBox, FiPlus, FiSmartphone, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProductTable from "../components/ProductTable";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Topbar from "../components/Topbar";
import { useProducts } from "../context/useProducts";

export default function Dashboard() {
  const { products } = useProducts();
  const stats = useMemo(() => {
    const total = products.length;
    const newPhones = products.filter((item) => item.type === "New").length;
    const usedPhones = products.filter((item) => item.type === "Used").length;
    return { total, newPhones, usedPhones };
  }, [products]);

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="p-4 sm:p-6 lg:ml-[260px] lg:p-8">
        <Topbar />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-7">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Welcome back, Admin!</h1>
            <p className="mt-1 text-slate-500">Here&apos;s what&apos;s happening with your store today.</p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              index={0}
              icon={<FiBox className="text-2xl" />}
              title="Total Products"
              value={stats.total}
              subtitle="All phones in inventory"
            />
            <StatCard
              index={1}
              icon={<FiStar className="text-2xl" />}
              title="New Phones"
              value={stats.newPhones}
              subtitle="New condition phones"
            />
            <StatCard
              index={2}
              icon={<FiSmartphone className="text-2xl" />}
              title="Used Phones"
              value={stats.usedPhones}
              subtitle="Used condition phones"
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">Recent Added Products</h2>
              <Link
                to="/admin/products"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
              >
                View All
              </Link>
            </div>
            <ProductTable products={products.slice(0, 6)} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Quick Actions</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              <Link to="/admin/add-product">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <FiPlus className="text-xl" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">Add New Product</p>
                      <p className="text-sm text-slate-500">Add a new phone to inventory</p>
                    </div>
                  </div>
                  <span className="text-xl text-slate-400">›</span>
                </motion.div>
              </Link>

              <Link to="/admin/products">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <FiBox className="text-xl" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">View All Products</p>
                      <p className="text-sm text-slate-500">Manage and update your inventory</p>
                    </div>
                  </div>
                  <span className="text-xl text-slate-400">›</span>
                </motion.div>
              </Link>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
