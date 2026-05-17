import { motion, useReducedMotion } from "framer-motion";
import heroPhoneImage from "../../assets/mobile-img-mobi.jpeg";
import { aboutFeatures } from "../../data/aboutData";
import { viewportOnce } from "../../utils/animations";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const badge = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function PhoneMock() {
  return (
    <div className="mx-auto w-full max-w-[420px] translate-y-2 rounded-3xl border border-white/70 bg-white/88 p-4 shadow-lg">
      <img
        src={heroPhoneImage}
        alt="Featured smartphone"
        className="w-full rounded-3xl border border-slate-200/70 object-cover shadow-[0_14px_30px_rgba(15,23,42,0.10)]"
      />
    </div>
  );
}

export default function AboutHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(220,252,231,0.68)_0%,rgba(241,248,234,0.84)_44%,rgba(250,245,235,0.94)_100%)]" />
      </div>

      <div className="mm-container relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={viewportOnce}
            variants={container}
            className="text-center lg:max-w-[40rem] lg:self-center lg:text-left"
          >
            <motion.p
              variants={fadeLeft}
              className="text-xs font-semibold tracking-[0.28em] text-emerald-900/75"
            >
              ABOUT US
            </motion.p>

            <motion.h1
              variants={fadeLeft}
              className="mt-4 text-[38px] font-extrabold leading-[1.08] tracking-[-0.05em] text-gray-900 sm:text-[48px] lg:text-[58px]"
            >
              We&apos;re serious
              <br />
              about{" "}
              <span className="inline-block bg-[linear-gradient(135deg,#0f766e,#166534)] bg-clip-text font-black text-transparent">
                Phones
              </span>
              <br />
              and even more serious
              <br />
              about{" "}
              <span className="inline-block font-black text-dark">
                People
              </span>
              .
            </motion.h1>

            <motion.p
              variants={fadeLeft}
              className="mx-auto mt-5 max-w-[46ch] text-sm leading-7 text-gray-700 sm:text-[15px] lg:mx-0"
            >
              At Mobi Mart, we believe everyone deserves a great smartphone
              experience whether it&apos;s brand new or pre-owned. We focus on
              trusted quality, thoughtful guidance, and honest pricing that
              feels clear from the first conversation.
            </motion.p>

            <motion.div
              variants={container}
              className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-3"
            >
              {aboutFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    variants={badge}
                    className="flex items-center gap-3 rounded-2xl border border-white/45 bg-white/72 px-4 py-3.5 text-left shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
                  >
                    <span className="grid size-10 place-items-center rounded-2xl bg-white/95 ring-1 ring-black/5">
                      <Icon className="text-[18px] text-emerald-800" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold leading-5 text-gray-900">
                      {f.title}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={viewportOnce}
            variants={fadeRight}
            className="hidden self-center lg:block lg:justify-self-end"
          >
            <PhoneMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
