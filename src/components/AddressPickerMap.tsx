import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Compass, Loader2, CheckCircle2, AlertTriangle, X, MapPinOff } from "lucide-react";

interface AddressPickerMapProps {
  currentAddress: string;
  onAddressSelect: (address: string) => void;
}

type LocState = "idle" | "requesting" | "geocoding" | "success" | "error";

export default function AddressPickerMap({ currentAddress, onAddressSelect }: AddressPickerMapProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState<LocState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<string>("");

  const startLocationDetection = () => {
    setIsModalOpen(true);
    setState("requesting");
    setErrorMsg("");
    setCoords(null);
    setDetectedAddress("");

    if (!navigator.geolocation) {
      setState("error");
      setErrorMsg("Geolocation is not supported by this browser. Please type your address manually.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setState("geocoding");

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Geocoding service returned an unexpected response.");
          }

          const data = await response.json();
          
          if (data && data.display_name) {
            const addressStr = data.display_name;
            setDetectedAddress(addressStr);
            setState("success");
          } else {
            throw new Error("Could not parse coordinates into a valid street address.");
          }
        } catch (err: any) {
          console.error("Nominatim reverse geocoding failed:", err);
          setState("error");
          setErrorMsg("Could not convert coordinates to a physical address. Please type it manually.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setState("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg("Location access was denied. Please adjust your browser settings or enter the address manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg("Your location details are unavailable. Please verify that GPS/location services are active.");
            break;
          case error.TIMEOUT:
            setErrorMsg("The connection timed out while retrieving your GPS position. Please try again.");
            break;
          default:
            setErrorMsg("An unexpected issue occurred while requesting location access.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  };

  const handleApplyAddress = () => {
    if (detectedAddress) {
      onAddressSelect(detectedAddress);
    }
    setIsModalOpen(false);
    setState("idle");
  };

  return (
    <div className="w-full">
      {/* Sleek inline trigger button */}
      <button
        id="trigger-gps-location-btn"
        type="button"
        onClick={startLocationDetection}
        className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white hover:bg-neutral-50 hover:border-stone-400 py-3 px-4 text-xs font-semibold text-neutral-800 shadow-xs active:scale-[0.98] transition-all duration-200 group/loc"
      >
        <MapPin className="h-4 w-4 text-[#C8E600] group-hover/loc:scale-110 transition-transform duration-300 fill-black/10" />
        <span className="font-mono text-[11px] uppercase tracking-wider">📍 Use My Current Location</span>
      </button>

      {/* Modern, high-performance location detector popup */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            id="location-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          >
            <motion.div
              id="location-popup-box"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-[#F7F7F5] border border-stone-200/80 p-5 shadow-2xl transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
                <span className="font-mono text-[10px] font-black tracking-widest text-neutral-800 uppercase flex items-center gap-1.5">
                  <Compass className={`h-4 w-4 text-neutral-800 ${state === "requesting" || state === "geocoding" ? "animate-spin" : ""}`} />
                  GPS Location Service
                </span>
                <button
                  id="close-location-popup-btn"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200/60 hover:bg-black hover:text-[#C8E600] text-stone-700 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Contents */}
              <div className="py-5 space-y-4">
                {state === "requesting" && (
                  <div className="text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 border border-amber-100">
                      <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-neutral-800 font-mono uppercase tracking-wider">Awaiting Browser Permission</h5>
                      <p className="text-[10px] text-neutral-500 leading-normal max-w-[280px] mx-auto">
                        Please approve the secure browser location access dialog to detect your shipping details.
                      </p>
                    </div>
                  </div>
                )}

                {state === "geocoding" && (
                  <div className="text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-neutral-800 font-mono uppercase tracking-wider">Reverse Geocoding</h5>
                      <p className="text-[10px] text-neutral-500 leading-normal max-w-[280px] mx-auto">
                        Converting secure GPS coordinates to street level address format...
                      </p>
                    </div>
                    {coords && (
                      <div className="inline-block px-2.5 py-1 rounded-md bg-white border border-stone-200 text-[9px] font-mono text-stone-500">
                        LAT: {coords.lat.toFixed(5)} / LNG: {coords.lng.toFixed(5)}
                      </div>
                    )}
                  </div>
                )}

                {state === "success" && (
                  <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-neutral-800 font-mono uppercase tracking-wider">Address Detected!</h5>
                      <p className="text-[10px] text-neutral-500">
                        We have parsed the coordinates into a human-readable address.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-left">
                      <span className="text-[9px] font-mono font-black text-neutral-400 uppercase tracking-widest block mb-1">Detected Address</span>
                      <textarea
                        value={detectedAddress}
                        onChange={(e) => setDetectedAddress(e.target.value)}
                        className="w-full text-[11px] font-medium text-neutral-800 bg-transparent border-0 p-0 focus:ring-0 focus:outline-hidden min-h-[50px] resize-none"
                      />
                      <span className="text-[8px] text-stone-400 block border-t border-stone-100 pt-1 mt-1 text-right">
                        💡 You can edit this address manually.
                      </span>
                    </div>

                    {coords && (
                      <div className="text-[8px] font-mono text-stone-400">
                        Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={startLocationDetection}
                        className="flex-1 rounded-lg border border-stone-200 bg-white py-2 px-3 text-[10.5px] font-bold text-stone-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        Re-detect
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyAddress}
                        className="flex-1 rounded-lg bg-black text-[#C8E600] border border-black hover:bg-neutral-800 py-2 px-3 text-[10.5px] font-bold transition-colors cursor-pointer"
                      >
                        Apply Address
                      </button>
                    </div>
                  </div>
                )}

                {state === "error" && (
                  <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
                      <MapPinOff className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-neutral-800 font-mono uppercase tracking-wider">Location Failed</h5>
                      <p className="text-[10px] text-red-600 font-medium max-w-[280px] mx-auto leading-normal">
                        {errorMsg}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 rounded-lg border border-stone-200 bg-white py-2 px-3 text-[10.5px] font-bold text-stone-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        Enter Manually
                      </button>
                      <button
                        type="button"
                        onClick={startLocationDetection}
                        className="flex-1 rounded-lg bg-black text-[#C8E600] border border-black hover:bg-neutral-800 py-2 px-3 text-[10.5px] font-bold transition-colors cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
