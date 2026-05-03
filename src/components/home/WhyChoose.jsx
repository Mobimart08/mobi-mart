import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import whyChooseImage from "../../assets/mobi-why.png";

const points = [
  "Wide range of latest & pre-owned smartphones",
  "Guaranteed best prices in the market",
  "Helpful guidance for every phone upgrade",
  "Trusted by hundreds of happy customers",
];

const WhyChoose = () => {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <h2 className="text-2xl font-semibold text-dark sm:text-3xl md:text-4xl">
            Why Choose Us
          </h2>

          <p className="mt-4 max-w-md text-sm text-gray-600 sm:text-base">
            We make buying and upgrading smartphones simple, affordable, and
            trustworthy.
          </p>

          <div className="mt-8 space-y-5">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <FaCheckCircle className="mt-1 text-primary" />
                <p className="text-sm text-gray-600 sm:text-base">{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative order-1 flex min-h-[280px] items-center justify-center sm:min-h-[360px] md:order-2"
        >
          <div className="rounded-[28px] border border-gray-100 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
            <img
              src={whyChooseImage}
              alt="Featured smartphones"
              className="relative w-[260px] rounded-2xl object-cover sm:w-[320px] md:w-[360px] lg:w-[400px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoose;
