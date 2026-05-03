import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppHref } from "../../data/storeInfo";
import mobiLogo from "../../assets/mobi-logo.png";

const desktopLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About Us", path: "/about" },
];

const mobileLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "About", path: "/about" },
];

const backdropMotion = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerMotion = {
  hidden: { x: "100%" },
  show: { x: 0 },
  exit: { x: "100%" },
};

const whatsappHref = buildWhatsAppHref(
  "Hi, I want to know about available phones and current offers.",
);

const Navbar = ({ isMobileMenuOpen = false, setIsMobileMenuOpen }) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = typeof setIsMobileMenuOpen === "function";
  const isOpen = isControlled ? isMobileMenuOpen : uncontrolledIsOpen;
  const setIsOpen = isControlled ? setIsMobileMenuOpen : setUncontrolledIsOpen;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full bg-primary shadow-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center"
          aria-label="Mobi Mart home"
        >
          <img
            src={mobiLogo}
            alt="Mobi Mart"
            className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {desktopLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className="relative text-white/85 transition hover:text-white"
            >
              {({ isActive }) => (
                <span className="group relative">
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-yellow transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-xl bg-yellow px-5 py-2 font-medium text-white shadow-md transition-all duration-300 hover:bg-orange md:flex"
        >
          <FaWhatsapp />
          Chat on WhatsApp
        </motion.a>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15 md:hidden"
          aria-label="Open menu"
          aria-expanded={isOpen}
        >
          <FaBars />
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            variants={backdropMotion}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[70] bg-black/40 md:hidden"
            onClick={closeDrawer}
          >
            <motion.aside
              variants={drawerMotion}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              className="ml-auto flex h-screen w-[78%] max-w-[320px] flex-col bg-[linear-gradient(165deg,rgba(41,82,126,0.95),rgba(25,60,99,0.92))] px-6 pb-7 pt-6 shadow-[0_24px_60px_rgba(15,23,42,0.34)] backdrop-blur-md ring-1 ring-white/20"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  onClick={closeDrawer}
                  className="inline-flex items-center"
                  aria-label="Mobi Mart home"
                >
                  <img
                    src={mobiLogo}
                    alt="Mobi Mart"
                    className="h-10 w-auto object-contain"
                  />
                </Link>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/40 bg-white/20 p-3 text-white shadow-sm transition hover:bg-white/28"
                  aria-label="Close menu"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-8 flex flex-1 flex-col">
                <div className="space-y-2">
                  {mobileLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={closeDrawer}
                      className={({ isActive }) =>
                        `block rounded-2xl px-5 py-4 text-[17px] font-medium tracking-[0.01em] transition ${
                          isActive
                            ? "bg-white/22 text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)]"
                            : "bg-white/10 text-white/95 hover:bg-white/18 hover:text-white"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeDrawer}
                  className="mb-12 mt-auto inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl bg-yellow px-5 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-orange"
                >
                  <FaWhatsapp />
                  Chat on WhatsApp
                </a>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
