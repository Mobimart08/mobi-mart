import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileStickyBar from "./MobileStickyBar";

const MainLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="overflow-x-hidden text-dark">
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main>
        {children}
      </main>

      <Footer />
      <MobileStickyBar isHidden={isMobileMenuOpen} />
    </div>
  );
};

export default MainLayout;
