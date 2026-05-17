import { motion, useReducedMotion } from "framer-motion";
import { offerCards } from "../../data/aboutData";
import { viewportOnce } from "../../utils/animations";

const itemIn = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function OfferThumb({ Icon, accent }) {
  return (
    <div
      className={`relative grid size-16 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br ${accent} ring-1 ring-black/5`}
    >
      <div className="absolute -right-5 -top-5 size-16 rounded-full bg-emerald-200/40 blur-sm" />
      <Icon className="relative text-[22px] text-emerald-900/85" aria-hidden="true" />
    </div>
  );
}

export default function OfferSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-12 sm:py-14">
      <div className="mm-container">
        <motion.h2
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mm-display text-center text-3xl font-semibold tracking-tight text-[var(--mm-text)] sm:text-[34px]"
        >
          What We Offer
        </motion.h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {offerCards.map((o) => {
            const Icon = o.icon;
            return (
              <motion.div
                key={o.title}
                initial={reduceMotion ? undefined : "hidden"}
                whileInView={reduceMotion ? undefined : "show"}
                viewport={viewportOnce}
                variants={itemIn}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mm-glass flex items-center gap-4 rounded-3xl px-5 py-5 ring-1 ring-black/5 shadow-[0_14px_32px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.14)]"
              >
                <OfferThumb Icon={Icon} accent={o.accent} />
                <div>
                  <p className="text-sm font-semibold text-[var(--mm-text)]">
                    {o.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-700">
                    {o.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

