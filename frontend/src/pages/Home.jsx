import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Featured from "../components/home/Featured";
import WhyChoose from "../components/home/WhyChoose";
import { useStorefrontProducts } from "../storefront/useStorefrontProducts";

const Home = () => {
  const { products, error, isLoading } = useStorefrontProducts();

  return (
    <div className="pt-20 sm:pt-24">
      <Hero />
      <Services />
      <Featured products={products} error={error} isLoading={isLoading} />
      <WhyChoose />
    </div>
  );
};

export default Home;
