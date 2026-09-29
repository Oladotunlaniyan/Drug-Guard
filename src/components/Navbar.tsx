import React, { useState, useEffect } from 'react';
import { ShieldCheck, Camera, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tapScale } from '../utils/motion';

interface NavbarProps {
  onCheckMedicine: () => void;
  onScanMedicine: () => void;
  onOpenSafety: () => void;
  activeView: 'landing' | 'app';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onCheckMedicine,
  onScanMedicine,
  onOpenSafety,
  activeView,
  onNavigateHome,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'landing') {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        isScrolled
          ? 'bg-[#f6f8f4]/95 border-b border-[#dce8dc] shadow-2xs backdrop-blur-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[68px] sm:h-[72px] max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity / Wordmark - Always visible across all screen sizes */}
        <div className="flex items-center gap-6 lg:gap-8">
          <motion.button
            whileTap={tapScale}
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-[#1b4332] group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded-lg p-1 -m-1"
            aria-label="DrugGuard Home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1b4332] text-[#e5f2e6] shadow-2xs transition-transform group-hover:scale-105 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#9bdfb1]" strokeWidth={2.4} />
            </span>
            <div className="flex flex-col">
              <span className="text-[18px] sm:text-[19px] font-bold tracking-[-0.03em] text-[#16352a] leading-tight">
                DrugGuard
              </span>
            </div>
          </motion.button>

          {/* Laptop/Desktop (1024px+): Full horizontal nav */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-7 text-[14px] font-bold text-[#355845]">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="py-1.5 hover:text-[#1b4332] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="py-1.5 hover:text-[#1b4332] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('scanner')}
              className="py-1.5 hover:text-[#1b4332] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded"
            >
              Scanner
            </button>
            <button
              onClick={onOpenSafety}
              className="py-1.5 hover:text-[#1b4332] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded"
            >
              Safety
            </button>
          </nav>
        </div>

        {/* Right Actions Breakdown per spec:
            - Laptop/Desktop (1024px+): both action buttons visible, full nav displayed.
            - Tablet (640px-1023px): show the two action buttons; links collapse into hamburger.
            - Mobile (up to 639px): show ONLY primary "Check a medicine" button + hamburger; "Scan package" moves into hamburger menu.
        */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Tablet & Desktop (640px+): Secondary Scan Package Button */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={tapScale}
            onClick={onScanMedicine}
            className="hidden sm:inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#cbd9cc] bg-white px-3.5 sm:px-4 py-2 text-xs font-bold text-[#1b4332] hover:bg-[#eef6ed] transition-colors cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
          >
            <Camera className="w-4 h-4 text-[#2d6a4f]" />
            <span className="hidden md:inline">Scan packaging</span>
            <span className="md:hidden">Scan</span>
          </motion.button>

          {/* Primary Action Button: "Check a medicine" - visible on Mobile, Tablet, and Desktop */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={tapScale}
            onClick={onCheckMedicine}
            className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-[#1b4332] px-3.5 sm:px-4.5 py-2 text-xs font-bold text-white hover:bg-[#24563f] shadow-2xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
          >
            <Search className="w-4 h-4 text-[#9bdfb1]" />
            <span>Check a medicine</span>
          </motion.button>

          {/* Hamburger Menu Toggle Button: visible on Mobile & Tablet (<1024px) */}
          <motion.button
            whileTap={tapScale}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[#1b4332] hover:bg-[#eef6ed] rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Full-width Responsive Dropdown Panel (Mobile & Tablet <1024px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden w-full border-b border-[#dce8dc] bg-[#fcfdfc] px-4 sm:px-6 py-4 space-y-4 shadow-sm overflow-hidden"
          >
            <nav className="flex flex-col gap-1 text-sm font-bold text-[#16352a]">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="min-h-[44px] text-left flex items-center py-2.5 px-3 rounded-xl hover:bg-[#eef6ed] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="min-h-[44px] text-left flex items-center py-2.5 px-3 rounded-xl hover:bg-[#eef6ed] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('scanner')}
                className="min-h-[44px] text-left flex items-center py-2.5 px-3 rounded-xl hover:bg-[#eef6ed] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                Package Scanner
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSafety();
                }}
                className="min-h-[44px] text-left flex items-center py-2.5 px-3 rounded-xl hover:bg-[#eef6ed] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                Safety Limits
              </button>
            </nav>

            {/* Mobile Action in Menu: "Scan medicine packaging" (moved here on mobile per spec) */}
            <div className="pt-2 border-t border-[#edf1eb] flex flex-col gap-2.5 sm:hidden">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScanMedicine();
                }}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full border border-[#cbd9cc] bg-white py-2.5 text-xs font-bold text-[#1b4332] shadow-2xs hover:bg-[#eef6ed] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332]"
              >
                <Camera className="w-4 h-4 text-[#2d6a4f]" />
                <span>Scan medicine packaging</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
