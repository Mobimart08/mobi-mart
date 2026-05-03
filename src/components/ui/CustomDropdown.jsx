import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const dropdownAnim = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: "easeInOut" },
};

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const activeLabel = useMemo(() => {
    const match = options.find((opt) => opt.value === value);
    return match?.label || placeholder;
  }, [options, placeholder, value]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-sm text-dark shadow-sm outline-none transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.15)]"
      >
        <span>{activeLabel}</span>
        <FiChevronDown
          className={`text-base text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            {...dropdownAnim}
            className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl"
          >
            {options.map((opt) => (
              <li key={`${opt.value}-${opt.label}`}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-all duration-300 hover:bg-cream hover:text-primary ${
                    value === opt.value ? "bg-cream text-primary" : "text-dark"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
