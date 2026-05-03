import ProductCard from "../ui/ProductCard";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";

const ProductGrid = ({ products, isLoading = false, skeletonCount = 6 }) => {
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="mm-fade-in-grid grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p._id || p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
