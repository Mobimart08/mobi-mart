import { motion } from "framer-motion";

export default function StatCard({ icon, title, value, subtitle, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">{icon}</div>
      </div>
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="text-4xl font-semibold tracking-tight text-dark">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </motion.article>
  );
}
