/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserSession } from "../types";
import { getAthleteProfile, syncAthleteProfile, syncUserRecord } from "../lib/supabase";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (session: UserSession) => void;
}

export default function SignInModal({ isOpen, onClose, onSignInSuccess }: SignInModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    setError(null);
    if (!email) {
      setError("Please key in your email address.");
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address (e.g., user@domain.com).");
      return false;
    }
    if (!password) {
      setError("Please set a password.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (activeTab === "signup") {
      if (!name.trim()) {
        setError("Please enter your full athletic name.");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Confirmation password does not match.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const emailLower = email.toLowerCase();
      
      if (activeTab === "signin") {
        // 1. Attempt to fetch profile from Supabase
        const existingProfile = await getAthleteProfile(emailLower);
        
        let session: UserSession;
        if (existingProfile) {
          session = {
            email: existingProfile.email,
            name: existingProfile.name,
            streakDays: existingProfile.streakDays,
            points: existingProfile.points
          };
          // Sync with general users list table too
          await syncUserRecord(session.email, session.name);
          setSuccess("Signed in successfully! Loaded profile from Supabase.");
        } else {
          // If not exists in DB yet, create a default profile on the fly
          const generatedName = emailLower.split("@")[0].replace(".", " ");
          session = {
            email: emailLower,
            name: generatedName.charAt(0).toUpperCase() + generatedName.slice(1),
            streakDays: 12,
            points: 240
          };
          // Synchronize/upsert to Supabase
          await syncAthleteProfile(session);
          await syncUserRecord(session.email, session.name);
          setSuccess("Profile initialized and synced securely with Supabase!");
        }
        
        setTimeout(() => {
          setIsLoading(false);
          onSignInSuccess(session);
          setSuccess(null);
          onClose();
        }, 1200);
      } else {
        // 2. SignUp flow
        const session: UserSession = {
          email: emailLower,
          name: name.trim(),
          streakDays: 1, // Fresh sign up streak
          points: 50 // Signup welcome points
        };

        // Write directly to standard tables
        const isSynced = await syncAthleteProfile(session);
        await syncUserRecord(session.email, session.name);
        
        if (isSynced) {
          setSuccess("Athlete membership generated and saved in Supabase!");
        } else {
          setSuccess("Athlete profile generated successfully!");
        }

        setTimeout(() => {
          setIsLoading(false);
          onSignInSuccess(session);
          setSuccess(null);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.error("Auth submit error:", err);
      setError("An error occurred. Please make sure the Supabase tables are created.");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="signin-modal-portal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            id="signin-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Form Container Panel */}
          <motion.div
            id="signin-modal-content"
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-[#F7F7F5] border border-stone-200 shadow-2xl flex flex-col"
          >
            {/* Design header stripes */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#C8E600] via-black to-[#C8E600]" />

            {/* Top Close Bar */}
            <div className="absolute right-4 top-4 z-20">
              <button
                id="close-signin-modal"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition-all hover:bg-black hover:text-white cursor-pointer hover:rotate-90 duration-300"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-7 md:p-8 flex flex-col justify-between">
              {/* Branding Section */}
              <div className="text-center mb-6 mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF5D8] px-3.5 py-1 text-[10px] font-mono font-bold tracking-wider text-[#718200] uppercase mb-2">
                  <Sparkles className="h-3 w-3 text-[#C8E600] animate-pulse" />
                  STEPX ATHLETE CLUB
                </span>
                <h3 className="font-display text-2xl font-black text-neutral-900 tracking-tight uppercase">
                  {activeTab === "signin" ? "Athlete Portal" : "Join the Club"}
                </h3>
                <p className="text-stone-500 text-xs mt-1 max-w-xs mx-auto">
                  {activeTab === "signin"
                    ? "Log in to check performance logs, track streaks, and redeem athletic gears."
                    : "Create a membership card to claim a 20% discount and track fitness telemetry."}
                </p>
              </div>

              {/* Tabs Switcher */}
              <div className="flex bg-stone-200/60 p-1 rounded-full mb-6">
                <button
                  id="tab-signin-trigger"
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setError(null);
                  }}
                  className={`flex-1 text-center py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all cursor-pointer ${
                    activeTab === "signin"
                      ? "bg-white text-black shadow-xs"
                      : "text-stone-500 hover:text-black"
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="tab-signup-trigger"
                  type="button"
                  onClick={() => {
                    setActiveTab("signup");
                    setError(null);
                  }}
                  className={`flex-1 text-center py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all cursor-pointer ${
                    activeTab === "signup"
                      ? "bg-white text-black shadow-xs"
                      : "text-stone-500 hover:text-black"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Message Alerts */}
              {error && (
                <div id="signin-error-alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {success && (
                <div id="signin-success-alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5 text-emerald-600" />
                  <span className="font-semibold">{success}</span>
                </div>
              )}

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "signup" && (
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Full Athletic Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="e.g. Clark Kent"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-xs transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      placeholder="e.g. athlete@stepx.fit"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-xs transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-11 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-xs transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {activeTab === "signup" && (
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-xs transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Simulated Register / Login button */}
                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-black py-4 text-xs font-black text-white hover:bg-neutral-800 transition-all font-display tracking-widest uppercase cursor-pointer relative flex items-center justify-center shadow-md active:scale-99"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : activeTab === "signin" ? (
                    "Authorize Session"
                  ) : (
                    "Initialize Membership"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
