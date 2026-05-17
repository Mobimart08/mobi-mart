import { useMemo, useState } from "react";
import { FiBox, FiPlus, FiSmartphone, FiStar } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ConfirmationModal from "../components/ConfirmationModal";
import StatCard from "../components/StatCard";
import Topbar from "../components/Topbar";
import Pagination from "../components/Pagination";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import Spinner from "../../components/ui/Spinner";
import StatusMessage from "../../components/ui/StatusMessage";
import { useProducts } from "../context/useProducts";

export default function Products() {
  const { products, deleteProduct, isLoading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [condition, setCondition] = useState("All");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [productPendingDelete, setProductPendingDelete] = useState(null);
  const pageSize = 5;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q || product.name.toLowerCase().includes(q) || product.brand.toLowerCase().includes(q);
      const matchesCondition = condition === "All" || product.type === condition;
      return matchesSearch && matchesCondition;
    });
  }, [products, searchTerm, condition]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const stats = useMemo(() => {
    const total = products.length;
    const newPhones = products.filter((item) => item.type === "New").length;
    const usedPhones = products.filter((item) => item.type === "Used").length;
    return { total, newPhones, usedPhones };
  }, [products]);

  const handleDeletePrompt = (product) => {
    setProductPendingDelete(product);
    setError("");
  };

  const handleDelete = async () => {
    if (!productPendingDelete) {
      return;
    }

    try {
      const productId = productPendingDelete._id || productPendingDelete.id;
      setDeletingId(productId);
      setError("");
      await deleteProduct(productId);
      toast.success(`${productPendingDelete.name} deleted successfully.`);
      setProductPendingDelete(null);
    } catch (deleteError) {
      const message = deleteError.response?.data?.message || "Failed to delete product.";
      setError(message);
      toast.error(message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="p-4 sm:p-6 lg:ml-[260px] lg:p-8">
        <Topbar />
        <section className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Products / Inventory</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icon={<FiBox className="text-2xl" />}
              title="Total Products"
              value={stats.total}
              subtitle="All phones in inventory"
            />
            <StatCard
              icon={<FiStar className="text-2xl" />}
              title="New Phones"
              value={stats.newPhones}
              subtitle="New condition phones"
            />
            <StatCard
              icon={<FiSmartphone className="text-2xl" />}
              title="Used Phones"
              value={stats.usedPhones}
              subtitle="Used condition phones"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">Product List</h2>
              <Link
                to="/admin/add-product"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                <FiPlus />
                Add Product
              </Link>
            </div>

            <ProductFilters
              searchTerm={searchTerm}
              onSearchTermChange={(value) => {
                setSearchTerm(value);
                setPage(1);
              }}
              condition={condition}
              onConditionChange={(value) => {
                setCondition(value);
                setPage(1);
              }}
            />

            <div className="mt-4">
              <StatusMessage message={error} tone="error" className="mb-3" />
              {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10">
                  <Spinner label="Loading products..." />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="mm-empty-state">
                  <p className="text-base font-semibold text-slate-900">No matching products found</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try a different search term or add a new product to the inventory.
                  </p>
                </div>
              ) : (
                <ProductTable
                  products={paginatedProducts}
                  onDelete={(id) => {
                    const product = products.find((item) => (item._id || item.id) === id);
                    if (product) {
                      handleDeletePrompt(product);
                    }
                  }}
                  deletingId={deletingId}
                />
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <p>
                Showing{" "}
                {filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredProducts.length)} of{" "}
                {filteredProducts.length} entries
              </p>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
            {deletingId ? (
              <div className="mt-3">
                <Spinner label="Deleting product..." size="sm" className="justify-start" />
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <ConfirmationModal
        isOpen={Boolean(productPendingDelete)}
        title="Delete Product"
        description={
          productPendingDelete
            ? `Delete "${productPendingDelete.name}" from inventory? This action removes it from the database and storefront listing immediately.`
            : ""
        }
        confirmLabel="Delete Product"
        confirmTone="danger"
        onConfirm={handleDelete}
        onClose={() => {
          if (!deletingId) {
            setProductPendingDelete(null);
          }
        }}
        isProcessing={Boolean(deletingId)}
      />
    </div>
  );
}
