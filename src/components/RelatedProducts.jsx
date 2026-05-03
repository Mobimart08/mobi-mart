import ProductCard from "./ui/ProductCard";

export default function RelatedProducts({ products, currentId }) {
  const related = products
    .filter((item) => (item._id || item.id) !== currentId)
    .slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-primary/20 bg-cream p-4 shadow-md sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-dark sm:text-2xl">You may also like</h3>
      </div>
      <div className="flex gap-5 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4">
        {related.map((product) => (
          <div key={product._id || product.id} className="w-[260px] shrink-0 sm:w-auto">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
