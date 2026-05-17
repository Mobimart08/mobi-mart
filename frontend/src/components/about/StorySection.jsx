import { motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppHref } from "../../data/storeInfo";
import { viewportOnce } from "../../utils/animations";
import ourStoryImage from "../../assets/mobi-our-story.jpeg";

const imageIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

const textUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const whatsappHref = buildWhatsAppHref(
  "Hi, I want to know more about your store.",
);

export default function StorySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-12 sm:py-14">
      <div className="mm-container">
        <div className="grid items-center gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12">
          <motion.div
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={viewportOnce}
            variants={imageIn}
          >
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <img
                src={ourStoryImage}
                alt="Customers visiting the Mobi Mart store"
                className="h-full min-h-[320px] w-full rounded-[20px] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={viewportOnce}
            variants={textUp}
            className="max-w-xl"
          >
            <h2 className="mm-display text-3xl font-semibold tracking-tight text-[var(--mm-text)] sm:text-[34px]">
              Our Story
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              Mobi Mart started with a simple mission - to make buying
              smartphones easy, transparent, and reliable.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              From brand new flagship devices to carefully tested pre-owned
              phones, we offer strong value, honest pricing, and a smooth
              buying experience from start to finish.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              We are a local business, built on trust, quality, and long-term
              relationships with our customers.
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mm-cta-primary mt-6 w-full sm:w-auto"
            >
              <FaWhatsapp aria-hidden="true" />
              Chat with us on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
