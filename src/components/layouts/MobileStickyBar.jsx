import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import {
  buildWhatsAppHref,
  googleMapsHref,
  storePhoneHref,
} from "../../data/storeInfo";

const stickyWhatsappHref = buildWhatsAppHref(
  "Hi, I want to know about available phones and current offers.",
);

export default function MobileStickyBar({ isHidden = false }) {
  return (
    <div
      aria-hidden={isHidden}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/96 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur transition-all duration-300 ease-out md:hidden ${
        isHidden
          ? "pointer-events-none translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="mx-auto flex max-w-7xl gap-3">
        <a
          href={storePhoneHref}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          <FaPhoneAlt aria-hidden="true" />
          Call Now
        </a>
        <a
          href={stickyWhatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
        >
          <FaWhatsapp aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href={googleMapsHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-slate-800 transition hover:bg-slate-50"
          aria-label="Get store location"
        >
          <FaMapMarkerAlt aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
