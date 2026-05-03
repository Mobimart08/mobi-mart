import { motion, useReducedMotion } from "framer-motion";
import { whyChooseCards } from "../../data/aboutData";
import { viewportOnce } from "../../utils/animations";

const wrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyChoose() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-12 sm:py-14">
      <div className="mm-container">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mm-display text-3xl font-semibold tracking-tight text-[var(--mm-text)] sm:text-[34px]">
            Why Choose Mobi Mart?
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Quality devices, honest pricing, and quick support designed to make every upgrade feel simple.
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={viewportOnce}
          variants={wrap}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {whyChooseCards.map((c) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                variants={cardIn}
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mm-glass group rounded-3xl px-5 py-6 text-center shadow-[0_18px_40px_rgba(10,45,38,0.10)] ring-1 ring-black/5 hover:shadow-[0_22px_54px_rgba(10,45,38,0.16)]"
              >
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/80 ring-1 ring-black/5">
                  <Icon className="text-[20px] text-emerald-800" aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm font-semibold text-[var(--mm-text)]">
                  {c.title}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-700">
                  {c.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

