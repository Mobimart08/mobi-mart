import { motion } from "framer-motion";
import heroPhoneImage from "../../assets/mobile-img-mobi.jpeg";

export default function AdminLayout({
  title,
  subtitle,
  children,
  sideEyebrow = "Admin Panel",
  sideTagline = "Power your day-to-day operations with a cleaner, faster admin workspace.",
  sideNote = "Stay on top of products, pricing, and customer activity from one focused place.",
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-gray-200/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.14)] md:grid-cols-[1.02fr_1.18fr]"
      >
        <aside className="relative hidden overflow-hidden bg-primary p-10 md:block">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.015)_100%)]" />

          <div className="relative">
            <p className="text-sm font-medium tracking-[0.18em] text-white/70">
              {sideEyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Mobi <span className="text-yellow">Mart</span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/80">
              {sideTagline}
            </p>
          </div>

          <div className="relative mt-10 rounded-2xl bg-white/6 p-4 shadow-[0_20px_44px_rgba(0,0,0,0.16)]">
            <img
              src={heroPhoneImage}
              alt="Featured smartphone"
              className="mx-auto max-h-[23rem] rounded-2xl object-cover"
            />
          </div>

          <div className="relative mt-6 px-1">
            <p className="text-sm leading-6 text-white/78">{sideNote}</p>
          </div>
        </aside>

        <section className="bg-white px-6 py-7 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-semibold text-dark">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
