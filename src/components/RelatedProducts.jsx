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
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
