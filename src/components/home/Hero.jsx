import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaShieldAlt, FaStore, FaWhatsapp } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import heroPhoneImage from "../../assets/mobile-img-mobi.jpeg";
import { buildWhatsAppHref, googleMapsHref } from "../../data/storeInfo";

const heroWhatsappHref = buildWhatsAppHref(
  "Hi, I want to book a phone or visit your store. Please help me with the available options.",
);

const trustBadges = [
  { icon: FaStore, label: "500+ Happy Customers" },
  { icon: FaShieldAlt, label: "100% Verified Phones" },
  { icon: FiCheckCircle, label: "7-Day Checking Warranty" },
];

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-cream pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="order-2 md:order-1"
        >
          <h1 className="text-[34px] font-semibold leading-[1.15] text-dark sm:text-[42px] md:text-[48px] lg:text-[52px]">
            Buy New & Used <br />
            Smartphones at <span className="text-yellow">Best Prices</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-lg">
            Explore latest and pre-owned devices with premium quality and
            trusted service backed by hundreds of happy customers. Visit Store
            or Book on WhatsApp for quick assistance.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/shop" className="ds-btn-primary w-full px-6 py-3 sm:w-auto sm:px-7">
              Browse Phones
            </Link>

            <a
              href={heroWhatsappHref}
              target="_blank"
              rel="noreferrer"
              className="ds-btn-secondary w-full px-6 py-3 sm:w-auto sm:px-7"
            >
              <FaWhatsapp />
              Book on WhatsApp
            </a>

            <a
              href={googleMapsHref}
              target="_blank"
              rel="noreferrer"
              className="ds-btn-secondary w-full px-6 py-3 sm:w-auto sm:px-7"
            >
              <FaMapMarkerAlt aria-hidden="true" />
              Get Store Location
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <span
                  key={badge.label}
                  className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/60 px-3.5 py-3 text-sm font-medium text-gray-900 shadow-md transition-shadow duration-300 hover:shadow-lg"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon aria-hidden="true" />
                  </span>
                  {badge.label}
                </span>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative order-1 flex min-h-[260px] items-center justify-center sm:min-h-[320px] md:order-2"
        >
          <img
            src={heroPhoneImage}
            alt="Featured smartphone"
            loading="eager"
            decoding="async"
            className="relative w-[220px] rounded-[28px] border border-white/70 object-cover shadow-[0_20px_42px_rgba(15,23,42,0.18)] sm:w-[260px] md:w-[300px] lg:w-[330px]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
