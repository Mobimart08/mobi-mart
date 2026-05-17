import { motion } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getCloudinaryImageUrl } from "../../utils/cloudinaryImage";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProductRow({ product, index, onDelete, isDeleting = false }) {
  const navigate = useNavigate();
  const allowDelete = typeof onDelete === "function";
  const productId = product._id || product.id;
  const firstVariant = product.variants?.[0];
  const mainImage = getCloudinaryImageUrl(
    (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) ||
      product.image ||
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=160&auto=format&fit=crop",
    "thumbnail",
  );

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="border-t border-slate-100 text-slate-700"
    >
      <td className="px-5 py-3">
        <img
          src={mainImage}
          alt={product.name}
          className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
        />
      </td>
      <td className="px-5 py-3">
        <p className="font-medium text-slate-900">{product.name}</p>
        <p className="text-slate-500">{firstVariant?.storage || product.storage || "-"}</p>
      </td>
      <td className="px-5 py-3">{product.brand}</td>
      <td className="px-5 py-3">{firstVariant?.storage || product.storage || "-"}</td>
      <td className="px-5 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            product.type === "New" ? "bg-yellow text-dark" : "bg-gray-100 text-dark"
          }`}
        >
          {product.type}
        </span>
      </td>
      <td className="px-5 py-3 font-medium">{formatPrice(firstVariant?.price || product.price || 0)}</td>
      <td className="px-5 py-3">{formatDate(product.createdAt || product.date || new Date())}</td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            type="button"
            disabled={isDeleting}
            onClick={() => navigate(`/admin/edit-product/${productId}`)}
            className={`rounded-lg p-2 text-white shadow-sm ${
              isDeleting
                ? "cursor-not-allowed bg-slate-300"
                : "bg-primary hover:bg-[#0d2345]"
            }`}
            aria-label={`Edit ${product.name}`}
          >
            <FiEdit2 />
          </motion.button>
          <motion.button
            whileHover={{ y: -1 }}
            type="button"
            onClick={() => allowDelete && onDelete(productId)}
            className={`rounded-lg p-2 shadow-sm ${
              allowDelete && !isDeleting
                ? "bg-red-500 text-white hover:bg-red-600"
                : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
            disabled={!allowDelete || isDeleting}
            aria-label={`Delete ${product.name}`}
          >
            <FiTrash2 />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}
