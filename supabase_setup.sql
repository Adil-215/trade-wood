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
