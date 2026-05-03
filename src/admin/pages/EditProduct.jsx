import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useProducts } from "../context/useProducts";
import CustomDropdown from "../../components/ui/CustomDropdown";
import Spinner from "../../components/ui/Spinner";
import StatusMessage from "../../components/ui/StatusMessage";

const initialForm = {
  name: "",
  brand: "",
  storage: "",
  type: "New",
  price: "",
  images: [],
};

const conditionOptions = [
  { label: "New", value: "New" },
  { label: "Used", value: "Used" },
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const current = products.find((item) => (item._id || item.id) === id);
  const firstVariant = current?.variants?.[0];
  const initialCurrentForm = useMemo(() => {
    if (!current) return initialForm;
    return {
      name: current.name,
      brand: current.brand,
      storage: firstVariant?.storage || current.storage || "",
      type: current.type,
      price: String(firstVariant?.price || current.price || ""),
      images: current.images || (current.image ? [current.image] : []),
    };
  }, [current, firstVariant]);
  const [form, setForm] = useState(initialCurrentForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!current) {
    return <Navigate to="/admin/products" replace />;
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.brand.trim() || !form.storage.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    if (!Number(form.price) || Number(form.price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");
      await updateProduct(id, {
        name: form.name.trim(),
        brand: form.brand.trim(),
        description: current.description || "",
        type: form.type,
        images: form.images,
        variants: [
          {
            storage: form.storage.trim(),
            color: firstVariant?.color || "Default",
            price: Number(form.price),
          },
        ],
      });
      setSuccess("Product updated successfully. Redirecting...");
      navigate("/admin/products");
    } catch (updateError) {
      setError(updateError.response?.data?.message || "Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="p-4 sm:p-6 lg:ml-[260px] lg:p-8">
        <Topbar />
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h1 className="text-3xl font-semibold text-slate-900">Edit Product</h1>
          <p className="mb-6 text-slate-500">Update product details.</p>
          <StatusMessage message={error} tone="error" className="mb-3" />
          <StatusMessage message={success} tone="success" className="mb-3" />
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "iPhone 15 Pro Max" },
              { label: "Brand", name: "brand", type: "text", placeholder: "Apple" },
              { label: "Storage", name: "storage", type: "text", placeholder: "256GB" },
              { label: "Price", name: "price", type: "number", placeholder: "159900" },
            ].map((field) => (
              <label key={field.name} className={field.full ? "md:col-span-2" : ""}>
                <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
                <input
                  required
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className="mm-input"
                />
              </label>
            ))}

            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">Condition</span>
              <CustomDropdown
                value={form.type}
                onChange={(value) => {
                  setForm((prev) => ({ ...prev, type: value }));
                  setError("");
                }}
                options={conditionOptions}
              />
            </div>

            <div className="md:col-span-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="ds-btn-primary px-6 py-3 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" label="" className="gap-2 text-white" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Product"
                )}
              </motion.button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
