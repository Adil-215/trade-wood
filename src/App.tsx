/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TechSpecsSection from "./components/TechSpecsSection";
import ShowcaseSection from "./components/ShowcaseSection";
import AnalyticsSection from "./components/AnalyticsSection";
import ProductCatalog from "./components/ProductCatalog";
import AccessoriesSection from "./components/AccessoriesSection";
import NewsletterCTA from "./components/NewsletterCTA";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProductQuickViewModal from "./components/ProductQuickViewModal";
import AboutUs from "./components/AboutUs";
import FAQ from "./components/FAQ";
import NewArrivals from "./components/NewArrivals";

import { CartItem, ColorOption, Shoe } from "./types";
import { catalogList } from "./data";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeQuickViewShoe, setActiveQuickViewShoe] = useState<Shoe | null>(null);
  const [activePage, setActivePage] = useState<"home" | "about" | "faq" | "new-arrivals">("home");

  // Cart Handlers
  const handleAddToCart = (shoe: Shoe, color: ColorOption, size: number) => {
    const itemUniqueId = `${shoe.id}-${color.name.toLowerCase().replace(/\s+/g, "-")}-${size}`;
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === itemUniqueId);
      if (existingIndex > -1) {
        // Increment quantity
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        // Add new item configuring
        const newItem: CartItem = {
          id: itemUniqueId,
          shoe,
          selectedColor: color,
          selectedSize: size,
          quantity: 1
        };
        return [...prevCart, newItem];
      }
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Smooth Scroll Anchor Anchor Helpers
  const handleScrollToSection = (elementId: string) => {
    if (activePage !== "home") {
      setActivePage("home");
      setTimeout(() => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 120);
    } else {
      const targetElement = document.getElementById(elementId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen selection:bg-black selection:text-[#C8E600]">
      {/* Symmetrical Header Navigation */}
      <Navbar
        cartItems={cart}
        onOpenCart={() => setIsCartOpen(true)}
        catalogItems={catalogList}
        onScrollToSection={handleScrollToSection}
        onSelectShoeProduct={(shoe) => setActiveQuickViewShoe(shoe)}
        activePage={activePage}
        onChangePage={setActivePage}
      />

      {/* Main Sections Body */}
      <main className="w-full">
        {activePage === "about" ? (
          <AboutUs
            onBackToHome={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onExploreCatalog={() => {
              setActivePage("home");
              setTimeout(() => {
                handleScrollToSection("catalog-sec");
              }, 120);
            }}
          />
        ) : activePage === "faq" ? (
          <FAQ
            onBackToHome={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onExploreCatalog={() => {
              setActivePage("home");
              setTimeout(() => {
                handleScrollToSection("catalog-sec");
              }, 120);
            }}
          />
        ) : activePage === "new-arrivals" ? (
          <NewArrivals
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            onBackToHome={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : (
          <>
            {/* Core Hero Segment */}
            <HeroSection
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
            />

            {/* Exploded 3D Parts Technical Specifications */}
            <TechSpecsSection />

            {/* Premium Highlights Showcase & Live Telemetry Panel */}
            <ShowcaseSection
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onQuickView={(shoe) => setActiveQuickViewShoe(shoe)}
            />

            {/* Real-time Sales Metrics & Supply Telemetry Panel */}
            <AnalyticsSection />

            {/* Grid Catalog Series ( browse and filtering ) */}
            <ProductCatalog
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onQuickView={(shoe) => setActiveQuickViewShoe(shoe)}
            />

            {/* Premium Shoe Accessories ( laces, polish, shiner ) */}
            <AccessoriesSection
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onQuickView={(shoe) => setActiveQuickViewShoe(shoe)}
            />

            {/* High contrast center solid black block Newsletter */}
            <NewsletterCTA
              onScrollToCatalog={() => handleScrollToSection("catalog-sec")}
            />
          </>
        )}
      </main>

      {/* Footer copyright, socials and legal policies */}
      <Footer onScrollToTop={handleScrollToTop} onChangePage={setActivePage} />

      {/* --- FLOATING & DRAWER DIALOG INTERACTIVE PORTALS --- */}
      
      {/* Slideout Shop Card Tray drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Details Quickview Specifications modal popup */}
      <ProductQuickViewModal
        shoe={activeQuickViewShoe}
        onClose={() => setActiveQuickViewShoe(null)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}
