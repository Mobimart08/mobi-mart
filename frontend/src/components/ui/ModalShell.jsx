import { AnimatePresence, motion } from "framer-motion";

export default function ModalShell({
  isOpen,
  onClose,
  title,
  description = "",
  children,
  footer = null,
  widthClassName = "max-w-3xl",
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`w-full ${widthClassName} overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]`}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 id="modal-title" className="text-xl font-semibold text-slate-900">
                {title}
              </h2>
              {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

            {footer ? <div className="border-t border-slate-200 px-5 py-4 sm:px-6">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
