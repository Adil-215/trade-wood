/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

// Safe fallback credentials from the user's input
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ollcpzalkykbdfeaujjx.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_np_mqQ9Q5HK_-kKcAqxShQ_3Ca7jNiz";

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AthleteProfile {
  email: string;
  name: string;
  streakDays: number;
  points: number;
}

export interface UserRecord {
  email: string;
  name: string;
}

export interface OrderInput {
  email: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  bankName: string;
  routingNumber: string;
  bankAccount: string;
  isCod: boolean;
  subtotal: number;
  total: number;
  quantity: number;
  items: Array<{
    shoeId: string;
    shoeName: string;
    colorName: string;
    size: number;
    quantity: number;
    price: number;
  }>;
}

/**
 * Fetch athletic profile details from the database
 */
export async function getAthleteProfile(email: string): Promise<AthleteProfile | null> {
  try {
    const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.warn("Supabase athletes query error (may need to run migration SQL):", error.message);
      return null;
    }

    if (data) {
      return {
        email: data.email,
        name: data.name,
        streakDays: data.streak_days ?? 12,
        points: data.points ?? 240
      };
    }
  } catch (err: any) {
    console.error("Failed to query athlete profile:", err.message);
  }
  return null;
}

/**
 * Sync (Create or update) athletic profile details in the database
 */
export async function syncAthleteProfile(profile: AthleteProfile): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("athletes")
      .upsert({
        email: profile.email.toLowerCase(),
        name: profile.name,
        streak_days: profile.streakDays,
        points: profile.points,
        status: "active"
      }, { onConflict: "email" });

    if (error) {
      console.warn("Supabase upsert athlete warning (migration might be missing):", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("Failed to sync athlete profile:", err.message);
    return false;
  }
}

/**
 * Sync (Create or update) user details in the general users database table
 */
export async function syncUserRecord(email: string, name: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .upsert({
        email: email.toLowerCase(),
        name: name,
        status: "active",
        created_at: new Date().toISOString()
      }, { onConflict: "email" });

    if (error) {
      console.warn("Supabase upsert user warning (users table might be missing):", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("Failed to sync user record:", err.message);
    return false;
  }
}

/**
 * Update user and athlete status (e.g. active, suspended)
 */
export async function updateUserStatus(email: string, status: "active" | "suspended"): Promise<boolean> {
  try {
    const emailLower = email.toLowerCase();
    const [userRes, athleteRes] = await Promise.all([
      supabase
        .from("users")
        .update({ status })
        .eq("email", emailLower),
      supabase
        .from("athletes")
        .update({ status })
        .eq("email", emailLower)
    ]);

    if (userRes.error) {
      console.warn("Supabase update users status warning:", userRes.error.message);
    }
    if (athleteRes.error) {
      console.warn("Supabase update athletes status warning:", athleteRes.error.message);
    }
    return true;
  } catch (err: any) {
    console.error("Failed to update user status:", err.message);
    return false;
  }
}

/**
 * Create a new order purchase log in the database
 */
export async function createOrderLog(order: OrderInput): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("orders")
      .insert({
        email: order.email.toLowerCase(),
        customer_name: order.customerName,
        phone: order.phone,
        address: order.address,
        city: order.city,
        zip: order.zip,
        country: order.country,
        bank_name: order.bankName,
        routing_number: order.routingNumber,
        bank_account: order.bankAccount,
        is_cod: order.isCod,
        subtotal: order.subtotal,
        total: order.total,
        quantity: order.quantity,
        items: JSON.stringify(order.items)
      });

    if (error) {
      console.warn("Supabase order insert warning (migration might be missing):", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("Failed to submit order log details:", err.message);
    return false;
  }
}
