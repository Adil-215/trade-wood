/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2, Star, ArrowRight } from "lucide-react";

interface NewsletterCTAProps {
  onScrollToCatalog: () => void;
}

export default function NewsletterCTA({ onScrollToCatalog }: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate premium registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsJoined(true);
      setEmail("");
    }, 1200);
  };

  return (
    <section
      id="newsletter-sec"
      className="relative w-full overflow-hidden bg-black text-white py-24 px-6 md:px-12 flex flex-col items-center justify-center text-center"
    >
      {/* Abstract modern vector background elements to align with high tech theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#C8E600]/10 blur-[90px] -z-10" />

      <div className="mx-auto max-w-4xl space-y-8 relative z-10 flex flex-col items-center">
        {/* Simple floating badge */}
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-[#C8E600] text-[#C8E600] animate-pulse" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-[#C8E600] uppercase">
            STEPX ELITE RELEASE
          </span>
        </div>

        {/* Center Headline */}
        <h2 className="font-display text-4xl font-black tracking-tight uppercase md:text-6xl max-w-2xl leading-none">
          STEP INTO THE FUTURE.
        </h2>

        {/* Support instructions */}
        <p className="text-zinc-400 text-xs md:text-sm font-sans max-w-lg leading-relaxed">
          Be the first to claim upcoming limited drops, experimental custom sole technologies, and exclusive carbon fiber running systems. 
        </p>

        {/* Action Button & Input Form in symmetrical layout */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!isJoined ? (
              <motion.form
                id="newsletter-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col sm:flex-row items-center gap-2.5 w-full bg-neutral-900 border border-zinc-800 p-3 sm:p-1.5 rounded-2xl sm:rounded-full"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:flex-1 bg-transparent border-none text-white text-xs font-semibold placeholder-zinc-500 focus:outline-hidden px-4 py-3 sm:py-0 text-center sm:text-left"
                />
                
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-xl sm:rounded-full bg-[#C8E600] hover:bg-[#b0cc00] py-3 px-6 text-[11px] font-bold text-black tracking-widest uppercase transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  ) : (
                    <>
                      SIGN UP NOW
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                id="newsletter-success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center gap-2 bg-[#EDF5D8]/10 border border-[#C8E600]/20 rounded-2xl sm:rounded-full py-4 px-6 sm:px-8 justify-center text-[#C8E600] text-center"
              >
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase">
                  WELCOME TO THE MOVEMENT! 20% DISCOUNT ACTIVE
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secondary CTA: Quick Shopping Anchor */}
        <div className="pt-2">
          <button
            id="newsletter-shop-btn"
            onClick={onScrollToCatalog}
            className="group inline-flex items-center gap-2 rounded-full border border-zinc-800 text-xs text-stone-300 font-bold tracking-widest px-6 py-3 hover:bg-neutral-900 hover:text-white transition-all uppercase cursor-pointer"
          >
            Or Shop Collection
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
