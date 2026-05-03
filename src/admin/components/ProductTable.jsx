import { AnimatePresence } from "framer-motion";
import ProductRow from "./ProductRow";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[860px] w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Photo</th>
            <th className="px-5 py-4">Phone Name</th>
            <th className="px-5 py-4">Brand</th>
            <th className="px-5 py-4">Storage</th>
            <th className="px-5 py-4">Condition</th>
            <th className="px-5 py-4">Price</th>
            <th className="px-5 py-4">Added On</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {products.map((product, index) => (
              <ProductRow key={product._id || product.id} product={product} index={index} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
