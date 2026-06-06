/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, HelpCircle, Package, Zap, Compass, RefreshCw, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, ShieldCheck, Mail } from "lucide-react";

interface FAQProps {
  onBackToHome: () => void;
  onExploreCatalog: () => void;
}

interface FAQItem {
  id: string;
  category: "technology" | "sizing" | "materials" | "shipping";
  question: string;
  answer: string;
}

export default function FAQ({ onBackToHome, onExploreCatalog }: FAQProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "technology" | "sizing" | "materials" | "shipping">("all");
  const [expandedId, setExpandedId] = useState<string | null>("tech-1");

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "technology", label: "Propelled Tech", icon: Zap },
    { id: "sizing", label: "Fitting & Sizing", icon: Compass },
    { id: "materials", label: "Sustainable Foam", icon: RefreshCw },
    { id: "shipping", label: "Orders & Support", icon: Package },
  ];

  const faqData: FAQItem[] = [
    {
      id: "tech-1",
      category: "technology",
      question: "How do the carbon fiber composite plates enhance my running speed?",
      answer: "Our custom multi-axial carbon plate is embedded under continuous tension within the bio-foam matrix. As your heel strikes the ground, the plate stores the kinetic energy of the deflection and snaps back instantly into straight vertical-alignment upon toe-off. This creates an active trampoline effect that delivers speed-boosting propulsion and decreases oxygen/step energy expense by up to 4.2%."
    },
    {
      id: "tech-2",
      category: "technology",
      question: "Is StepX optimized for tracks, trails, or gym treadmills?",
      answer: "StepX's carbon-plate rigidity behaves optimally on hard and solid surfaces such as asphalt, concrete, and athletic rubberized tracks. For off-road and technical terrain running, we recommend our specialty trail models equipped with multidirectional lugs. They function fine on modern treadmills but the energy return properties are fully realized outdoors."
    },
    {
      id: "sizing-1",
      category: "sizing",
      question: "Should I select true-to-size or size up/down for StepX models?",
      answer: "Our dual-weave flyknit conforms snugly to your foot like a compression glove. For high-density racing where zero horizontal shifting is required, order true-to-size. If you prefer standard everyday room or wear thicker performance socks, we highly recommend ordering half a size larger."
    },
    {
      id: "sizing-2",
      category: "sizing",
      question: "Can I insert custom orthopedic insoles into my StepX shoe?",
      answer: "Yes, our performance anti-slip premium sockliners are fully removable. However, please note that third-party thick medical orthotics may slightly adjust the height of your heel, shifting your foot away from the calculated sweet-spot of the carbon-plate propulsion curve."
    },
    {
      id: "materials-1",
      category: "materials",
      question: "What makes the StepX bio-foams environmentally sustainable?",
      answer: "Traditional commercial running shoes use heavy petroleum-derived EVA foam. StepX’s foam cores are formulated using organic polyols sourced directly from certified organic plants and cross-linked with recycled marine plastics. It delivers high-impact bounce while biodegrading safely under composting conditions when discarded, minimizing toxic lifetime footprints."
    },
    {
      id: "materials-2",
      category: "materials",
      question: "What is the expected mileage lifetime of a pair of StepX?",
      answer: "We engineer carbon plates for ultimate long-term memory. The plate retains its elastic recoil indefinitely. Our bio-foams and high-abrasion rubber outsoles are rated for up to 800 kilometers of high-performance speed running before significant elasticity depletion begins to manifest."
    },
    {
      id: "shipping-1",
      category: "shipping",
      question: "How long does standard global lab dispatch and shipping take?",
      answer: "Because we assemble StepX gear in specialized limited batches, orders typically dispatch from our testing laboratory in 1-2 business days. Shipping times range from 3-5 days for domestic premium routes and 5-8 business days for international express shipping. All tracking info is pushed instantly to your mobile email."
    },
    {
      id: "shipping-2",
      category: "shipping",
      question: "What is the 30-Day Trailblazer stress guarantee?",
      answer: "We believe in our science. If any StepX shoes do not deliver a measurable gain in speed, running economy, or tracking output, you can send them back within 30 days of delivery. Yes, even if you logged fifty competitive miles and have mud on the outsoles. We refund 100% of your payment with zero friction."
    }
  ];

  // Filtering Logic
  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      id="faq-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#F7F7F5] min-h-screen pt-8 pb-20 px-6 md:px-12 selection:bg-black selection:text-[#C8E600]"
    >
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
          <button
            id="faq-back-breadcrumb"
            onClick={onBackToHome}
            className="hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3 w-3" /> HOME
          </button>
          <span>/</span>
          <span className="text-black uppercase">ATHLETE SUPPORT & FAQ</span>
        </div>

        {/* Hero Header Banner */}
        <div className="space-y-6 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-[#718200] uppercase shadow-2xs">
            <HelpCircle className="h-3.5 w-3.5 text-[#C8E600]" />
            STEPX KINETIC KNOWLEDGE ENGINE
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-neutral-900 uppercase">
            Frequently Asked <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-[#718200]">
              Biomechanical Queries
            </span>
          </h1>
          <p className="text-stone-600 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
            Sift through empirical answers about our proprietary carbon-plated propulsion, recycled ocean polymer compositions, shipping logs, and elite fit optimization curves.
          </p>
        </div>

        {/* Search and Navigation filters */}
        <div className="space-y-6">
          {/* Smart Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input
              type="text"
              id="faq-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search running technology, sizes, dispatch, foam lifecycle..."
              className="w-full rounded-full border border-stone-200 bg-white py-4.5 pl-13 pr-6 text-sm font-semibold tracking-wide placeholder-stone-400 focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold hover:text-black text-stone-400 uppercase tracking-widest cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Symmetrical Category Selector */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start" id="faq-categories">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`faq-cat-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                    isActive
                      ? "bg-black text-white shadow-md scale-102"
                      : "bg-white border border-stone-200 text-stone-600 hover:border-black hover:text-black"
                  }`}
                >
                  <IconComp className="h-3.5 w-3.5 shrink-0" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion List Body */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout="position"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-stone-100 last:border-none pb-4 last:pb-0"
                    id={`faq-block-${faq.id}`}
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full flex items-start justify-between text-left py-4 gap-4 hover:opacity-90 select-none cursor-pointer group"
                    >
                      <h3 className="font-display text-sm md:text-base font-black text-neutral-900 tracking-tight group-hover:text-[#718200] transition-colors leading-snug">
                        {faq.question}
                      </h3>
                      <div className="mt-0.5 rounded-full bg-stone-100 p-1 font-bold text-neutral-500 group-hover:bg-[#EDF5D8] group-hover:text-[#718200] transition-colors shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-4 pt-1 font-sans text-xs md:text-sm text-stone-600 leading-relaxed font-medium pl-1 max-w-3xl">
                            {faq.answer}
                            
                            {/* Metadata category tag inside */}
                            <span className="inline-block mt-4 font-mono text-[9px] font-bold tracking-wider text-[#718200] bg-[#EDF5D8] px-2 py-0.5 rounded uppercase">
                              Category: {faq.category}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center space-y-3"
              >
                <div className="h-10 w-10 text-neutral-400 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-5 w-5" />
                </div>
                <p className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest">
                  No matching queries found
                </p>
                <p className="text-stone-400 text-xs max-w-xs mx-auto">
                  Try typing basic terms like "carbon", "size", "sustainable", "return" or browse another research category.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic CTA Footer card */}
        <div className="bg-black text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
          {/* Symmetrical Tech Grid Pattern Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left max-w-md">
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-[#C8E600] uppercase bg-stone-900 border border-stone-850 px-2 py-0.5 rounded">
                <ShieldCheck className="h-3.5 w-3.5 text-[#C8E600]" /> GUARANTEED ASSISTANCE
              </span>
              <h3 className="font-display text-xl md:text-2xl font-black tracking-tight uppercase leading-tight">
                HAVE A CUSTOM OUTSOLE CONVICTION?
              </h3>
              <p className="text-stone-400 text-xs font-mono">
                Connect directly with our primary laboratory biomechanics staff for tailored advice, custom sole sizing alignments, or track trials coordination.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <button
                id="faq-contact-btn"
                onClick={() => {
                  alert("Support tickets are fully logged on our end. Reach us at athletes@stepxlabs.com ⚡");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C8E600] text-black font-display text-xs font-black tracking-widest uppercase px-6 py-3.5 hover:bg-white transition-all cursor-pointer shadow-xs"
              >
                <Mail className="h-3.5 w-3.5" />
                EMAIL LABORATORY
              </button>
              <button
                id="faq-explore-btn"
                onClick={onExploreCatalog}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-800 bg-stone-950 text-white font-mono text-xs font-bold tracking-wider uppercase px-6 py-3.5 hover:bg-stone-900 hover:border-stone-700 transition-all cursor-pointer"
              >
                VIEW CORE GEAR <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
