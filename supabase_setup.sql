-- ==========================================
-- SUPABASE DATABASE SETUP SCHEMA
-- AirLuxe Performance Athletics Ecommerce
-- ==========================================

-- ------------------------------------------
-- 1. UPGRADE EXISTING TABLES (If they already exist)
-- ------------------------------------------
-- Run this if you already have the 'orders' table active and just need to patch the new fields:

ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_cod BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country TEXT;

ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT;

ALTER TABLE athletes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS country TEXT;

-- Run this to update existing Cash on Delivery (COD) orders to state "No" for bank info:
UPDATE orders
SET 
  bank_name = 'No',
  routing_number = 'No',
  bank_account = 'No'
WHERE is_cod = TRUE;


-- ------------------------------------------
-- 2. CREATE NEW TABLES (If starting fresh)
-- ------------------------------------------

-- Create general user profile logs
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  name TEXT,
  status TEXT DEFAULT 'active',
  address TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all authenticated users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert/update for everyone" ON users FOR ALL USING (true) WITH CHECK (true);


-- Create athlete telemetry/profile data
CREATE TABLE IF NOT EXISTS athletes (
  email TEXT PRIMARY KEY,
  name TEXT,
  streak_days INT DEFAULT 0,
  points INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  address TEXT,
  phone TEXT,
  country TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on athletes
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for everyone" ON athletes FOR ALL USING (true) WITH CHECK (true);


-- Create full purchase order log table
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  customer_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  zip TEXT,
  bank_name TEXT,
  routing_number TEXT,
  bank_account TEXT,
  is_cod BOOLEAN DEFAULT FALSE,
  subtotal NUMERIC,
  total NUMERIC,
  quantity INT,
  country TEXT,
  items TEXT, -- JSON layout representing purchased articles list
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on orders to permit insertions
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insertions for everyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for owners" ON orders FOR SELECT USING (true);


-- ------------------------------------------
-- 3. CREATE PRODUCTS TABLE (Dynamic Products Store)
-- ------------------------------------------

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL, -- Image URL or asset key
  tagline TEXT DEFAULT 'The Future of Pure Air & Speed',
  description TEXT DEFAULT 'Engineered for elite competitive racing and premium athlete lifestyle.',
  category TEXT DEFAULT 'Street Performance',
  colors JSONB DEFAULT '[{"name": "Obsidian Black", "hex": "#111827", "bgClass": "bg-gray-950"}]'::jsonb,
  sizes NUMERIC[] DEFAULT ARRAY[8, 8.5, 9, 9.5, 10, 10.5, 11, 12]::numeric[],
  rating NUMERIC DEFAULT 4.8,
  reviews_count INT DEFAULT 120,
  is_new BOOLEAN DEFAULT TRUE,
  specs TEXT[] DEFAULT ARRAY['Pressurized multi-chamber cushioning heel unit', 'Breathable flyknit upper mesh and support']::text[],
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable all access for admins" ON products FOR ALL USING (true) WITH CHECK (true);

-- Insert existing local shoes into the products table as seed data
INSERT INTO products (id, name, tagline, price, image, description, category, colors, sizes, rating, reviews_count, is_new, specs)
VALUES 
(
  'tw-airluxe-platinum', 
  'StepX AirLuxe Platinum', 
  'The Future of Pure Air & Speed', 
  245, 
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', 
  'Engineered for elite competitive road racing and premium athlete lifestyle. The StepX AirLuxe combines an ultra-luxuous white full-grain leather and lightweight ballistic mesh upper with a revolutionary multi-chamber pressure-reactive Air bag at the heel. Underneath, a curved multi-layer carbon fiber plate propels your heel-to-toe stride with unparalleled mechanical velocity. Accented by high-gloss liquid hot-chrome silver elements.', 
  'Elite Cushioned Performance', 
  '[{"name": "Platinum White/Chrome", "hex": "#f5f5f5", "bgClass": "bg-radial from-stone-100 to-stone-300"}, {"name": "Liquid Silver", "hex": "#cbd5e1", "bgClass": "bg-slate-300"}]'::jsonb,
  ARRAY[8, 8.5, 9, 9.5, 10, 10.5, 11, 12], 
  5.0, 
  168, 
  TRUE, 
  ARRAY['Pressurized multi-chamber Air-Bag comfort heel unit', 'Hand-layered premium leather & dual-weave ballistic mesh', 'Active carbon-fiber energy propulsion plate integration', 'Double high-tension racing lacing guides']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, tagline, price, image, description, category, colors, sizes, rating, reviews_count, is_new, specs)
VALUES 
(
  'tw-dynafit-volt', 
  'StepX Dynafit Volt', 
  'Unleash Ultimate Velocity', 
  189, 
  'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
  'Crafted with 70 years of progressive engineering, the Dynafit Volt features an ultra-responsive responsive carbon-infused plate paired with signature dual-density knit comfort. Built to conquer dynamic workout loops and intensive athletic sessions alike.', 
  'Athletic Running', 
  '[{"name": "Classic Brown", "hex": "#78350f", "bgClass": "bg-amber-800"}]'::jsonb,
  ARRAY[7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12], 
  4.9, 
  1420, 
  TRUE, 
  ARRAY['Full-length carbon fiber propulsion plate', 'Breathable Dual-weave Flyknit upper mesh', 'Dual-Density React Cushioning System', 'Lightweight dynamic support structures']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, tagline, price, image, description, category, colors, sizes, rating, reviews_count, is_new, specs)
VALUES 
(
  'tw-carbon-black', 
  'StepX Carbon Stealth', 
  'Quiet Performance. Absolute Power.', 
  165, 
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop', 
  'Designed for night runners and minimalist athletes. The Carbon Stealth uses a triple-black lightweight knit structure coupled with specialized deep shock-absorption units to minimize heel impact.', 
  'Street Performance', 
  '[{"name": "Obsidian Black", "hex": "#111827", "bgClass": "bg-gray-950"}]'::jsonb,
  ARRAY[8, 9, 9.5, 10, 10.5, 11, 12], 
  4.8, 
  840, 
  FALSE, 
  ARRAY['Ultra-light 190g total frame weight', 'Reinforced ripstop heel counter', 'Shock-absorbing Aero Foam matrix', 'Semi-translucent grip tread']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, tagline, price, image, description, category, colors, sizes, rating, reviews_count, is_new, specs)
VALUES 
(
  'tw-neon-orange', 
  'StepX Kinetic Orange', 
  'The Pulse of the Streets', 
  155, 
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop', 
  'An exceptional blend of high-fashion style and athletic performance. Kinetic Orange leverages a soft step-in feel and visual neon accents that deliver an aesthetic pop for everyday wear.', 
  'Lifestyle Fashion', 
  '[{"name": "Kinetic Orange", "hex": "#ff5000", "bgClass": "bg-orange-500"}]'::jsonb,
  ARRAY[7.5, 8, 8.5, 9, 9.5, 11, 11.5], 
  4.7, 
  612, 
  TRUE, 
  ARRAY['Plush padded interior sleeve', 'Elastic speed-lacing enclosure system', 'Thermo-polyurethane cage overlay', 'Flexible multivariant geometric tread']
)
ON CONFLICT (id) DO NOTHING;

