/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Twitter, Linkedin, Facebook, HelpCircle, FileText, ArrowUp } from "lucide-react";

interface FooterProps {
  onScrollToTop: () => void;
  onChangePage?: (page: "home" | "about") => void;
}

export default function Footer({ onScrollToTop, onChangePage }: FooterProps) {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const handleShowDoc = (title: string, content: string) => {
    setActivePopup({ title, content });
  };

  return (
    <footer className="w-full bg-stone-950 text-stone-500 py-12 md:py-16 px-6 md:px-12 border-t border-stone-900">
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-8 md:flex-row">
        
        {/* Left Section: Branding & Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <span className="font-display text-lg font-black tracking-tight text-white uppercase">
            StepX
          </span>
          <p className="text-[11px] text-stone-600 font-mono text-center md:text-left">
            © {new Date().getFullYear()} STEPX LABS CO. ALL PERFORMANCE RIGHTS RESERVED.
          </p>
        </div>

        {/* Center Section: Standard Links with custom premium doc view interactive mock modals */}
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-mono tracking-widest font-bold text-stone-400">
          <button
            id="footer-about-btn"
            onClick={() => {
              if (onChangePage) onChangePage("about");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            About Us
          </button>

          <button
            id="footer-privacy-btn"
            onClick={() =>
              handleShowDoc(
                "PRIVACY POLICY",
                "Your workout and biometric performance data is yours alone. We encrypt tracking outputs and never sell your personal information to third parties. Verified compliant with global health telemetry storage standards."
              )
            }
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            Privacy Policy
          </button>
          
          <button
            id="footer-terms-btn"
            onClick={() =>
              handleShowDoc(
                "TERMS & CONDITIONS",
                "By purchasing StepX, you step into pre-order specifications under physical dispatch limits. Our carbon plates are engineered for athletic surfaces. Use responsibly to break maximum speed records!"
              )
            }
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            Terms & Conditions
          </button>

          <button
            id="footer-help-btn"
            onClick={() =>
              handleShowDoc(
                "HELP & CUSTOM CARE",
                "Contact our specialized StepX athlete trainers via standard email or open-support threads. Custom sole corrections and sizing upgrades can be coordinated within 30 days of shipment receipt."
              )
            }
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            Support
          </button>
        </div>

        {/* Right Section: Social Media Icons and Scroll To Top */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-stone-400">
            <a
              id="twitter-social-link"
              href="#twitter"
              onClick={(e) => { e.preventDefault(); alert("Twitter/X connected to @StepXActive ✅"); }}
              className="hover:text-white transition-colors"
              aria-label="Twitter Profile Link"
            >
              <Twitter className="h-4.5 w-4.5 stroke-1.5" />
            </a>
            <a
              id="linkedin-social-link"
              href="#linkedin"
              onClick={(e) => { e.preventDefault(); alert("LinkedIn connected to StepX Laboratories ✅"); }}
              className="hover:text-white transition-colors"
              aria-label="LinkedIn Company Profile"
            >
              <Linkedin className="h-4.5 w-4.5 stroke-1.5" />
            </a>
            <a
              id="facebook-social-link"
              href="#facebook"
              onClick={(e) => { e.preventDefault(); alert("Facebook profile synced ✅"); }}
              className="hover:text-white transition-colors"
              aria-label="Facebook Page Profile"
            >
              <Facebook className="h-4.5 w-4.5 stroke-1.5" />
            </a>
          </div>

          <button
            id="footer-scroll-top"
            onClick={onScrollToTop}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-stone-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* FOOTER DIALOG EXPANSIONS FOR FULL RICH UTILITY */}
      {activePopup && (
        <div id="footer-dialog-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-[#F7F7F5] text-neutral-900 p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-4">
              <FileText className="h-5 w-5 text-[#718200]" />
              <h4 className="font-display text-xs font-black tracking-widest uppercase">
                {activePopup.title}
              </h4>
            </div>
            
            <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">
              {activePopup.content}
            </p>

            <button
              id="footer-dialog-close"
              onClick={() => setActivePopup(null)}
              className="w-full rounded-full bg-black py-2.5 mt-5 text-xs text-white font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
            >
              ACKNOWLEDGE & CLOSE
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
