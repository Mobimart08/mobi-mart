import { motion, useReducedMotion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import {
  buildBusinessWhatsAppHref,
  buildWhatsAppHref,
  businessPhone,
  businessPhoneHref,
  googleMapsHref,
  storeAddressLines,
  storePhone,
} from "../../data/storeInfo";
import { viewportOnce } from "../../utils/animations";

const footerWhatsappHref = buildWhatsAppHref(
  "Hi, I want to know more about your store and available phones.",
);

const footerBusinessWhatsappHref = buildBusinessWhatsAppHref(
  "Hi, I want to connect for a business-related inquiry.",
);

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      id="contact"
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.65, ease: "easeInOut" }}
      className="relative mt-10 bg-primary pb-20 md:pb-0"
    >
      <div className="mm-container">
        <div className="grid gap-8 py-12 text-left text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-4">
          <div>
              <p className="text-base font-semibold text-white">Mobi Mart</p>
            <p className="mt-2 text-sm text-white/70">
              Your trusted destination for new and used smartphones with honest
              prices and reliable support.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="grid size-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
                aria-label="Instagram"
              >
                <FaInstagram aria-hidden="true" />
              </a>
              <a
                href="#"
                className="grid size-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
                aria-label="Facebook"
              >
                <FaFacebookF aria-hidden="true" />
              </a>
              <a
                href={footerWhatsappHref}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10 transition hover:bg-white/15"
                aria-label="WhatsApp"
              >
                <FaWhatsapp aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-base font-semibold text-white">Quick Links</p>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "About", href: "/about" },
              ].map((l) => (
                <li key={l.label}>
                  <a className="hover:text-white hover:underline" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold text-white">Contact Us</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li>{storePhone}</li>
              <li>Chat on WhatsApp</li>
              <li className="pt-2 text-white">Business Contact</li>
              <li>
                <a
                  href={businessPhoneHref}
                  className="transition hover:text-white hover:underline"
                >
                  {businessPhone}
                </a>
              </li>
              {storeAddressLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <a
              href={footerBusinessWhatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-400/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-400/25"
            >
              <FaWhatsapp aria-hidden="true" />
              Business Chat
            </a>
            <a
              href={googleMapsHref}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Open in Maps
            </a>
          </div>

          <div>
            <p className="text-base font-semibold text-white">Store Timings</p>
            <ul className="mt-3 space-y-2 text-white/70">
              <li>Monday - Saturday: 10:00 AM - 8:00 PM</li>
              <li>Sunday: 11:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
            © {new Date().getFullYear()} Mobi Mart. All rights reserved.
        </div>
      </div>

      <a
        href="#home"
        className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white/90 ring-1 ring-white/10 transition hover:bg-white/15 sm:bottom-6 sm:right-6"
        aria-label="Back to top"
      >
        <FiArrowUpRight aria-hidden="true" />
      </a>
    </motion.footer>
  );
}
