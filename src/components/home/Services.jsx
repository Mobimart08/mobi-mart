import { motion } from "framer-motion";
import { FaCheckCircle, FaMobileAlt, FaTags } from "react-icons/fa";

const services = [
  {
    icon: <FaMobileAlt />,
    title: "Buy New Phones",
    desc: "Latest smartphones with full warranty and best pricing.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Buy Used Phones",
    desc: "Certified pre-owned devices in excellent condition.",
  },
  {
    icon: <FaTags />,
    title: "Best Price Guarantee",
    desc: "Get the most competitive prices in the market.",
  },
];

const Services = () => {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-2xl font-semibold text-dark sm:text-3xl md:text-4xl">
            Our Services
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Everything you need to buy, sell, or upgrade your phone
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-lg sm:p-8"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary transition group-hover:bg-primary group-hover:text-white">
                {service.icon}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-dark sm:text-xl">
                {service.title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-600">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
