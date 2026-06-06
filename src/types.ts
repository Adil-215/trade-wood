/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorOption {
  name: string;
  hex: string;
  bgClass: string;
}

export interface Shoe {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  colors: ColorOption[];
  sizes: number[];
  rating: number;
  reviewsCount: number;
  category: string;
  isNew?: boolean;
  specs: string[];
}

export interface CartItem {
  id: string; // unique cart item id (combined shoe info, color, and size)
  shoe: Shoe;
  selectedColor: ColorOption;
  selectedSize: number;
  quantity: number;
}

export interface TechNode {
  id: string;
  name: string;
  top: string; // CSS position top (e.g., '20%')
  left: string; // CSS position left (e.g., '40%')
  description: string;
}
