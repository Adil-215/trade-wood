/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, Phone, MapPin, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserSession } from "../types";
import { getAthleteProfile, syncAthleteProfile, syncUserRecord, updateUserStatus, saveLocalPassword, getLocalPassword } from "../lib/supabase";
import AddressPickerMap from "./AddressPickerMap";

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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
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
      if (!phone.trim()) {
        setError("Please enter your phone number.");
        return false;
      }
      if (!address.trim()) {
        setError("Please enter your shipping address.");
        return false;
      }
      if (!country.trim()) {
        setError("Please select your country.");
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
          // Password check/verification
          const dbPassword = existingProfile.password;
          const localPassword = getLocalPassword(emailLower);
          const expectedPassword = dbPassword || localPassword;
          
          if (expectedPassword) {
            if (password !== expectedPassword) {
              setError("Incorrect password");
              setIsLoading(false);
              return;
            }
          } else {
            // First time saving a password for an existing account with empty password field
            saveLocalPassword(emailLower, password);
            await syncUserRecord(existingProfile.email, existingProfile.name, undefined, undefined, undefined, password);
          }

          session = {
            email: existingProfile.email,
            name: existingProfile.name,
            streakDays: existingProfile.streakDays,
            points: existingProfile.points
          };
          // Sync with general users list table too
          await syncUserRecord(session.email, session.name, undefined, undefined, undefined, password);
          await updateUserStatus(session.email, "active");
          setSuccess("Congratulations!");
        } else {
          setError("This account does not exist");
          setIsLoading(false);
          return;
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
          points: 50, // Signup welcome points
          phone: phone.trim(),
          address: address.trim(),
          country: country.trim()
        };

        // Write directly to standard tables
        const isSynced = await syncAthleteProfile({ ...session, password });
        await syncUserRecord(session.email, session.name, session.address, session.phone, session.country, password);
        await updateUserStatus(session.email, "active");
        
        // Save password locally as well
        saveLocalPassword(emailLower, password);
        
        setSuccess("Congratulations!");

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
                  Log In
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
                <div id="signin-error-alert" className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {success && (
                <div id="signin-success-alert" className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
                  <span className="font-semibold">{success}</span>
                </div>
              )}

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="max-h-[340px] overflow-y-auto pr-2 space-y-4 -mr-2 scrollbar-thin">
                  {activeTab === "signup" && (
                    <>
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

                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                          <input
                            type="tel"
                            placeholder="e.g. +1 (555) 123-4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isLoading}
                            className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-xs transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                          Shipping Address (or auto-detect below)
                        </label>
                        <div className="relative mb-2">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                          <input
                            type="text"
                            placeholder="e.g. 123 Elite Athlete Way"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={isLoading}
                            className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-4 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-xs transition-colors"
                          />
                        </div>
                        <AddressPickerMap
                          currentAddress={address}
                          onAddressSelect={(newAddr) => setAddress(newAddr)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                          Country Location
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            disabled={isLoading}
                            className="w-full rounded-xl border border-stone-200 bg-white py-3.5 pl-11 pr-8 text-xs font-medium focus:border-black focus:ring-1 focus:ring-black outline-hidden shadow-xs transition-colors appearance-none cursor-pointer"
                          >
                            <option value="">Select Country</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Japan">Japan</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="Spain">Spain</option>
                            <option value="Italy">Italy</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="India">India</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-1 text-stone-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </>
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
                </div>

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
