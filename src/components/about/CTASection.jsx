import { motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppHref } from "../../data/storeInfo";
import { viewportOnce } from "../../utils/animations";

const whatsappHref = buildWhatsAppHref(
  "Hi, I want to know more about your store.",
);

export default function CTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pb-14 sm:pb-16">
      <div className="mm-container">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mm-glass flex flex-col items-start justify-between gap-5 rounded-3xl bg-[linear-gradient(135deg,rgba(34,183,170,0.22),rgba(255,255,255,0.84))] px-6 py-6 shadow-[0_22px_54px_rgba(15,23,42,0.10)] sm:flex-row sm:items-center sm:px-8"
        >
          <div className="flex w-full items-start gap-4 sm:w-auto sm:items-center">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 ring-1 ring-emerald-900/10">
              <FaWhatsapp className="text-[22px] text-emerald-900/85" aria-hidden="true" />
            </span>
            <div className="max-w-xl">
              <p className="text-base font-semibold text-slate-950">
                Have questions? We&apos;re here to help!
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Chat with us on WhatsApp and get instant assistance.
              </p>
            </div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mm-cta-primary w-full shrink-0 sm:w-auto"
          >
            Chat on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

