/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Wind, ShieldAlert, Award, Eye } from "lucide-react";
import { technicalNodes } from "../data";
import { TechNode } from "../types";
import explodedTechnicalView from "../assets/images/exploded_technical_view_1780681288397.png";

export default function TechSpecsSection() {
  const [activeNode, setActiveNode] = useState<TechNode | null>(technicalNodes[1]); // Carbon Propulsion select by default

  return (
    <section
      id="tech-sec"
      className="relative w-full overflow-hidden px-6 md:px-12 py-20 lg:py-28 bg-[#ECECE9]" // Subtle light-gray contrast as requested
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        {/* Left Column (span 7): Interactive Exploded Blueprints */}
        <div id="tech-left-graphics" className="lg:col-span-7 flex flex-col items-center">
          <span className="font-mono text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4 text-center lg:text-left w-full pl-5">
            MECHANICAL SCHEMATICS / EXPLODED 3D RENDER
          </span>

          <div className="relative w-full max-w-lg aspect-square bg-[#F7F7F5] rounded-3xl border border-stone-300/40 p-6 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Exploded diagram image */}
            <img
              src={explodedTechnicalView}
              alt="StepX Exploded Tech View"
              className="w-11/12 h-auto object-contain transition-transform hover:scale-105 rounded-3xl"
              referrerPolicy="no-referrer"
            />

            {/* Locator Node Points mapped precisely over the design */}
            {technicalNodes.map((node) => {
              const isActive = activeNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  style={{ top: node.top, left: node.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  {/* Ping Animation around active node */}
                  {isActive && (
                    <span className="absolute -inset-2.5 rounded-full bg-[#C8E600]/30 animate-ping" />
                  )}
                  {/* Button trigger */}
                  <button
                    id={`tech-node-${node.id}`}
                    onClick={() => setActiveNode(isActive ? null : node)}
                    className={`flex h-6.5 w-6.5 items-center justify-center rounded-full border shadow-md cursor-pointer transition-all ${
                      isActive
                        ? "bg-[#C8E600] border-black text-black scale-120"
                        : "bg-white border-stone-300 text-neutral-800 hover:scale-110 hover:border-black"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </button>

                  {/* Desktop Quick hover tooltip when not active */}
                  {!isActive && (
                    <span className="absolute top-8 left-1/2 -translate-x-1/2 rounded bg-black/90 px-2.5 py-1 text-[9px] font-mono text-white opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none">
                      {node.name.substring(3)}
                    </span>
                  )}

                  {/* Responsive inline schematic leader line & label without heavy background */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`absolute z-40 pointer-events-none cursor-default ${
                          node.id === "node-upper"
                            ? "bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
                            : node.id === "node-plate"
                            ? "left-6 top-1/2 -translate-y-1/2 flex items-center"
                            : node.id === "node-midsole"
                            ? "right-6 top-1/2 -translate-y-1/2 flex flex-row-reverse items-center"
                            : "top-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
                        }`}
                      >
                        {/* Leader Connection Line & Labeled Text Block */}
                        {node.id === "node-upper" && (
                          <>
                            {/* Text above */}
                            <div className="text-center whitespace-nowrap select-none mb-1">
                              <span className="block font-mono font-bold text-[9px] uppercase tracking-wider text-stone-800">
                                {node.name.split(". ")[1] || node.name}
                              </span>
                            </div>
                            {/* Line below text to dot */}
                            <div className="w-px h-4 bg-[#6E8100]/70" />
                          </>
                        )}

                        {node.id === "node-plate" && (
                          <>
                            {/* Line to right off dot */}
                            <div className="h-px w-4 bg-[#6E8100]/70" />
                            {/* Text on right */}
                            <div className="text-left whitespace-nowrap select-none ml-1">
                              <span className="block font-mono font-bold text-[9px] uppercase tracking-wider text-stone-800">
                                {node.name.split(". ")[1] || node.name}
                              </span>
                            </div>
                          </>
                        )}

                        {node.id === "node-midsole" && (
                          <>
                            {/* Line to left off dot */}
                            <div className="h-px w-4 bg-[#6E8100]/70" />
                            {/* Text on left */}
                            <div className="text-right whitespace-nowrap select-none mr-1">
                              <span className="block font-mono font-bold text-[9px] uppercase tracking-wider text-stone-800">
                                {node.name.split(". ")[1] || node.name}
                              </span>
                            </div>
                          </>
                        )}

                        {node.id === "node-outsole" && (
                          <>
                            {/* Line above text to dot */}
                            <div className="w-px h-4 bg-[#6E8100]/70" />
                            {/* Text below */}
                            <div className="text-center whitespace-nowrap select-none mt-1">
                              <span className="block font-mono font-bold text-[9px] uppercase tracking-wider text-stone-800">
                                {node.name.split(". ")[1] || node.name}
                              </span>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick instructions indicator */}
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-neutral-500">
            <Eye className="h-3.5 w-3.5 text-neutral-400" />
            <span>SELECT THE GLOWING NODES TO REVEAL SPECIFICATIONS</span>
          </div>
        </div>

        {/* Right Column (span 5): Tech descriptions and core values heading */}
        <div id="tech-right-content" className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <span className="font-mono text-xs font-bold tracking-widest text-[#718200] uppercase block">
              ADVANCED COMPONENT RESEARCH
            </span>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-neutral-900 leading-none sm:text-5xl">
              ENGINEERED.
              <span className="block text-black font-black">TESTED.</span>
              <span className="block text-[#718200] font-black">PROVEN.</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-600 font-sans leading-relaxed pt-2">
              Discover the advanced comfort technology and energy-return foam driving every step. Built for performance, designed for you.
            </p>
          </div>

          {/* Dynamic Technical Layer Card details */}
          <div className="min-h-48 border border-stone-300/60 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-md relative overflow-hidden">
            {/* Ambient visual line accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8E600]" />

            <AnimatePresence mode="wait">
              {activeNode ? (
                <motion.div
                  key={activeNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8E600]/25 text-[#718200]">
                      {activeNode.id.includes("upper") ? (
                        <Wind className="h-4 w-4" />
                      ) : activeNode.id.includes("plate") ? (
                        <Cpu className="h-4 w-4" />
                      ) : (
                        <Award className="h-4 w-4" />
                      )}
                    </span>
                    <h4 className="font-display text-base font-black tracking-tight text-neutral-900 uppercase">
                      {activeNode.name}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans font-medium">
                    {activeNode.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200/80">
                    <div>
                      <span className="block text-[8px] font-mono text-stone-400 uppercase">INNOVATION TIER</span>
                      <strong className="text-[10px] font-mono text-stone-900 uppercase">CL-9 LAB GRADE</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-stone-400 uppercase">PROPULSOR METRIC</span>
                      <strong className="text-[10px] font-mono text-[#718200]">+24% ENERGY RETURN</strong>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-xs text-neutral-400 font-mono">
                    Select any mechanical node layer on the graph to analyze material metrics.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
