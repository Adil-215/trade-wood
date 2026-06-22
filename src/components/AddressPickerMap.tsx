import React, { useState, useEffect, useRef } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { Navigation, AlertCircle } from "lucide-react";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

interface AddressPickerMapProps {
  currentAddress: string;
  onAddressSelect: (address: string) => void;
}

function InnerMap({ currentAddress, onAddressSelect }: AddressPickerMapProps) {
  const map = useMap();
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>({ lat: 37.7749, lng: -122.4194 }); // default: SF
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [isSelectedFeedback, setIsSelectedFeedback] = useState(false);
  const lastGeocodedAddressRef = useRef<string>("");

  useEffect(() => {
    if (map) {
      setGeocoder(new google.maps.Geocoder());
    }
  }, [map]);

  // Attempt to geocode initial address if available and not already matching last selection
  useEffect(() => {
    if (!geocoder || !currentAddress || currentAddress.trim() === "" || currentAddress === lastGeocodedAddressRef.current) return;

    const timer = setTimeout(() => {
      geocoder.geocode({ address: currentAddress }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const loc = results[0].geometry.location;
          const latLng = { lat: loc.lat(), lng: loc.lng() };
          setMarkerPos(latLng);
          map?.panTo(latLng);
        }
      });
    }, 1000); // Debounce typing

    return () => clearTimeout(timer);
  }, [geocoder, currentAddress, map]);

  // Handle Map Search
  const handleMapSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geocoder || !searchQuery.trim()) return;

    setIsGeocoding(true);
    setSearchFeedback(null);
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      setIsGeocoding(false);
      if (status === "OK" && results?.[0]) {
        const loc = results[0].geometry.location;
        const latLng = { lat: loc.lat(), lng: loc.lng() };
        setMarkerPos(latLng);
        map?.panTo(latLng);
        map?.setZoom(15);
        
        const formatted = results[0].formatted_address;
        lastGeocodedAddressRef.current = formatted;
        onAddressSelect(formatted);
        
        setSearchFeedback("Found!");
        setIsSelectedFeedback(true);
        setTimeout(() => {
          setSearchFeedback(null);
          setIsSelectedFeedback(false);
        }, 2000);
      } else {
        setSearchFeedback("Retry");
        setTimeout(() => setSearchFeedback(null), 2000);
      }
    });
  };

  // Handle map clicks
  const handleMapClick = (e: any) => {
    if (!e.detail?.latLng) return;
    const clickedLatLng = {
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    };
    triggerReverseGeocode(clickedLatLng);
  };

  const triggerReverseGeocode = (latLng: google.maps.LatLngLiteral) => {
    setMarkerPos(latLng);
    if (!geocoder) return;

    setIsGeocoding(true);
    geocoder.geocode({ location: latLng }, (results, status) => {
      setIsGeocoding(false);
      if (status === "OK" && results?.[0]) {
        const formatted = results[0].formatted_address;
        lastGeocodedAddressRef.current = formatted;
        onAddressSelect(formatted);
        
        setIsSelectedFeedback(true);
        setTimeout(() => setIsSelectedFeedback(false), 2000);
      }
    });
  };

  // Drag-end handler on AdvancedMarker
  const handleMarkerDragEnd = (e: any) => {
    if (!e.latLng) return;
    const draggedLatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    triggerReverseGeocode(draggedLatLng);
  };

  // Locate user using browser Geolocation API
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map?.panTo(userPos);
          map?.setZoom(15);
          triggerReverseGeocode(userPos);
        },
        (error) => {
          console.warn("Geolocation failed or permitted. Error code:", error.code);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-stone-200 shadow-inner">
      <Map
        defaultCenter={markerPos}
        defaultZoom={13}
        mapId="ADDRESS_PICKER_MAP_ID"
        onClick={handleMapClick}
        internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
        style={{ width: "100%", height: "100%" }}
        gestureHandling="cooperative"
        disableDefaultUI={true}
        zoomControl={true}
      >
        <AdvancedMarker
          position={markerPos}
          gmpDraggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </Map>

      {/* Floating Geosearch Bar */}
      <form
        onSubmit={handleMapSearch}
        className="absolute top-2 left-2 right-2 max-w-[240px] flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg shadow-md border border-stone-200/80 z-10"
      >
        <input
          type="text"
          placeholder="Search location map..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent px-2 py-0.5 text-[9px] font-sans font-medium text-neutral-900 focus:outline-hidden border-none focus:ring-0 w-full"
        />
        <button
          type="submit"
          className="bg-black hover:bg-neutral-800 text-[#C8E600] rounded-md px-2 py-1 text-[8px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
        >
          {searchFeedback || "Search"}
        </button>
      </form>

      {/* Locate Me Button Overlay */}
      <button
        type="button"
        onClick={handleLocateMe}
        className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-stone-700 shadow-md hover:bg-stone-50 border border-stone-200 active:scale-95 transition-all z-10 cursor-pointer"
        title="Find My Location"
      >
        <Navigation className="h-4 w-4 fill-stone-700" />
      </button>

      {isGeocoding && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white rounded-full px-3 py-1 text-[9px] font-mono flex items-center gap-1.5 shadow-md z-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8E600] animate-ping" />
          Identifying Address...
        </div>
      )}

      {isSelectedFeedback && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-neutral-950 text-[#C8E600] border border-neutral-800 rounded-full px-3 py-1 text-[9px] font-mono flex items-center gap-1.5 shadow-lg animate-pulse z-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8E600]" />
          Address Written!
        </div>
      )}
    </div>
  );
}

export default function AddressPickerMap({ currentAddress, onAddressSelect }: AddressPickerMapProps) {
  if (!hasValidKey) {
    return (
      <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50/50 p-4 text-center">
        <div className="flex justify-center mb-1.5">
          <AlertCircle className="h-5 w-5 text-stone-400" />
        </div>
        <p className="text-[10px] font-mono text-stone-500 max-w-xs mx-auto leading-relaxed">
          Google Map inactive. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> in Secrets (⚙️ gear icon, top-right) to display the interactive address picker map.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <InnerMap currentAddress={currentAddress} onAddressSelect={onAddressSelect} />
    </APIProvider>
  );
}
