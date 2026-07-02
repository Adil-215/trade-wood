/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shoe, TechNode } from "./types";
import tradewoodShoeHero from "./assets/images/tradewood_shoe_hero_1780681267999.png";
import carbonBlackSneaker from "./assets/images/carbon_black_sneaker_1780681346294.png";
import neonOrangeSneaker from "./assets/images/neon_orange_sneaker_1780681366059.png";
import tradewoodLaces from "./assets/images/tradewood_laces_solid_1780744709425.png";
import tradewoodPolish from "./assets/images/tradewood_polish_solid_1780744730252.png";
import tradewoodShiner from "./assets/images/tradewood_shiner_solid_1780744751870.png";
import airluxeWhiteSneaker from "./assets/images/airluxe_white_1780768734752.png";

export const airluxeShoe: Shoe = {
  id: "tw-airluxe-platinum",
  name: "StepX AirLuxe Platinum",
  tagline: "The Future of Pure Air & Speed",
  price: 245,
  originalPrice: 280,
  image: airluxeWhiteSneaker,
  description: "Engineered for elite competitive road racing and premium athlete lifestyle. The StepX AirLuxe combines an ultra-luxuous white full-grain leather and lightweight ballistic mesh upper with a revolutionary multi-chamber pressure-reactive Air bag at the heel. Underneath, a curved multi-layer carbon fiber plate propels your heel-to-toe stride with unparalleled mechanical velocity. Accented by high-gloss liquid hot-chrome silver elements.",
  colors: [
    { name: "Platinum White/Chrome", hex: "#f5f5f5", bgClass: "bg-radial from-stone-100 to-stone-300" }
  ],
  sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
  rating: 5.0,
  reviewsCount: 168,
  category: "Elite Cushioned Performance",
  isNew: true,
  specs: [
    "Pressurized multi-chamber Air-Bag comfort heel unit",
    "Hand-layered premium leather & dual-weave ballistic mesh",
    "Active carbon-fiber energy propulsion plate integration",
    "Double high-tension racing lacing guides"
  ]
};

export const flagshipShoe: Shoe = {
  id: "tw-dynafit-volt",
  name: "StepX Dynafit Volt",
  tagline: "Unleash Ultimate Velocity",
  price: 189,
  originalPrice: 220,
  image: tradewoodShoeHero,
  description: "Crafted with 70 years of progressive engineering, the Dynafit Volt features an ultra-responsive responsive carbon-infused plate paired with signature dual-density knit comfort. Built to conquer dynamic workout loops and intensive athletic sessions alike.",
  colors: [
    { name: "Classic Brown", hex: "#78350f", bgClass: "bg-amber-800" }
  ],
  sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
  rating: 4.9,
  reviewsCount: 1420,
  category: "Athletic Running",
  isNew: true,
  specs: [
    "Full-length carbon fiber propulsion plate",
    "Breathable Dual-weave Flyknit upper mesh",
    "Dual-Density React Cushioning System",
    "Lightweight dynamic support structures"
  ]
};

export const catalogList: Shoe[] = [
  airluxeShoe,
  flagshipShoe,
  {
    id: "tw-carbon-black",
    name: "StepX Carbon Stealth",
    tagline: "Quiet Performance. Absolute Power.",
    price: 165,
    image: carbonBlackSneaker,
    description: "Designed for night runners and minimalist athletes. The Carbon Stealth uses a triple-black lightweight knit structure coupled with specialized deep shock-absorption units to minimize heel impact.",
    colors: [
      { name: "Obsidian Black", hex: "#111827", bgClass: "bg-gray-950" }
    ],
    sizes: [8, 9, 9.5, 10, 10.5, 11, 12],
    rating: 4.8,
    reviewsCount: 840,
    category: "Street Performance",
    isNew: false,
    specs: [
      "Ultra-light 190g total frame weight",
      "Reinforced ripstop heel counter",
      "Shock-absorbing Aero Foam matrix",
      "Semi-translucent grip tread"
    ]
  },
  {
    id: "tw-neon-orange",
    name: "StepX Kinetic Orange",
    tagline: "The Pulse of the Streets",
    price: 155,
    originalPrice: 180,
    image: neonOrangeSneaker,
    description: "An exceptional blend of high-fashion style and athletic performance. Kinetic Orange leverages a soft step-in feel and visual neon accents that deliver an aesthetic pop for everyday wear.",
    colors: [
      { name: "Kinetic Orange", hex: "#ff5000", bgClass: "bg-orange-500" }
    ],
    sizes: [7.5, 8, 8.5, 9, 9.5, 11, 11.5],
    rating: 4.7,
    reviewsCount: 612,
    category: "Lifestyle Fashion",
    isNew: true,
    specs: [
      "Plush padded interior sleeve",
      "Elastic speed-lacing enclosure system",
      "Thermo-polyurethane cage overlay",
      "Flexible multivariant geometric tread"
    ]
  }
];

export const technicalNodes: TechNode[] = [
  {
    id: "node-upper",
    name: "1. Responsive Dual-Weave Flyknit",
    top: "24%",
    left: "45%",
    description: "A single piece of breathable knit material that forms to your foot, eliminating friction points while offering targeted lateral support."
  },
  {
    id: "node-plate",
    name: "2. Carbon Fiber Propulsion Plate",
    top: "37%",
    left: "53%",
    description: "Sandwiched between foam layers, the custom carbon weave rigid plate provides instant energy return, launching you forward with every toe-off."
  },
  {
    id: "node-midsole",
    name: "3. Dual-Density Aero Foam",
    top: "58%",
    left: "32%",
    description: "Varying hardness density sections supply comfortable cushioning for landings and high-reactivity bounce for forward motion."
  },
  {
    id: "node-outsole",
    name: "4. Geometric Traction Core",
    top: "75%",
    left: "48%",
    description: "Strategic compound rubber nodes designed specifically to capture moisture and grip pavement in any climate condition."
  }
];

export const accessoriesList: Shoe[] = [
  {
    id: "acc-laces-volt",
    name: "Apex Volt Lock Laces",
    tagline: "High-Tensile Kinetic Closure",
    price: 15,
    originalPrice: 20,
    image: tradewoodLaces,
    description: "Engineered from high-tensile interwoven neon nylon fibres and standard carbon locks to ensure absolute slip-free closure during high-velocity sprint sessions. Custom tailored to perfect length matching our Dynafit line.",
    colors: [
      { name: "Neon Volt", hex: "#C8E600", bgClass: "bg-[#C8E600]" }
    ],
    sizes: [0], // 0 stands for Universal Size, we will handle this in UI!
    rating: 4.8,
    reviewsCount: 312,
    category: "Accessories",
    isNew: true,
    specs: [
      "Slip-proof dual tension smart dynamic lock",
      "Interwoven core with active reflective strands",
      "Reinforced aglet endpoints prevent fraying",
      "120cm optimized length"
    ]
  },
  {
    id: "acc-polish-cream",
    name: "Revitalize Leather Polish Cream",
    tagline: "Absolute Hydrophobic Shield",
    price: 24,
    image: tradewoodPolish,
    description: "Premium restoration leather cream and polish designed with advanced microclear molecules. Revitalizes color, waterproofs fiber surfaces, and feeds the natural elasticity of active performance-treated fabrics.",
    colors: [
      { name: "Neutral Clear", hex: "#f5f5f5", bgClass: "bg-stone-100" }
    ],
    sizes: [0],
    rating: 4.9,
    reviewsCount: 185,
    category: "Accessories",
    isNew: false,
    specs: [
      "Natural beeswax and carnauba formulation",
      "Protective active silver water-barrier layer",
      "Ultra gloss finish without dynamic residue",
      "Anti-cracking structural hydration agents"
    ]
  },
  {
    id: "acc-shiner-brush",
    name: "StepX Horsehair Shiner Brush",
    tagline: "Ergonomic Beechwood Polish",
    price: 22,
    originalPrice: 28,
    image: tradewoodShiner,
    description: "A dual-action ergonomic beechwood shoe-buffing and shine brush. Features dense, soft premium natural horsehair bristles that lift microscopic dirt from deep within knit meshes, combined with a high-rebound finish sponge.",
    colors: [
      { name: "Beechwood Natural", hex: "#d7ccc8", bgClass: "bg-amber-100" }
    ],
    sizes: [0],
    rating: 4.7,
    reviewsCount: 94,
    category: "Accessories",
    isNew: true,
    specs: [
      "Ergonomic hand-carved beechwood handle",
      "Dense 100% genuine select grey horsehair bristles",
      "Scratch-free on delicate flyknits and calfskin",
      "Optimized curved design for side grooves styling"
    ]
  }
];

