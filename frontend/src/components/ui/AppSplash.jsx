import { AnimatePresence, motion } from "framer-motion";

const backdropMotion = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelMotion = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.02, y: -8 },
};

export default function AppSplash({ visible }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          variants={backdropMotion}
          initial="hidden"
          animate="show"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,196,61,0.16),transparent_32%),linear-gradient(180deg,rgba(255,251,243,0.98),rgba(247,250,249,0.98))] px-6"
          aria-live="polite"
          aria-label="Loading Mobi Mart"
        >
          <motion.div
            variants={panelMotion}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="w-full max-w-sm rounded-[32px] border border-white/70 bg-white/85 p-8 text-center shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-primary text-xl font-bold tracking-[0.18em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)]">
              MM
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-slate-900">Mobi Mart</h1>
            <p className="mt-2 text-sm text-slate-500">Loading the latest inventory for you.</p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="h-3 w-3 animate-[mm-bounce_1s_ease-in-out_infinite] rounded-full bg-primary" />
              <span className="h-3 w-3 animate-[mm-bounce_1s_ease-in-out_0.15s_infinite] rounded-full bg-yellow" />
              <span className="h-3 w-3 animate-[mm-bounce_1s_ease-in-out_0.3s_infinite] rounded-full bg-orange" />
            </div>

            <div className="mt-6 overflow-hidden rounded-full bg-slate-100">
              <div className="mm-shimmer h-2 w-full rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
