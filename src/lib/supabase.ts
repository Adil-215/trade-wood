/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

// Safe fallback credentials from the user's input
const rawUrl = import.meta.env.VITE_SUPABASE_URL || "https://ollcpzalkykbdfeaujjx.supabase.co";
const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_np_mqQ9Q5HK_-kKcAqxShQ_3Ca7jNiz";

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getAthletesTable(): Promise<string> {
  return "users";
}

// Memoize columns to prevent redundant schema checking queries
const memoizedColumns: Record<string, string[]> = {};

export async function getAvailableColumns(tableName: string): Promise<string[]> {
  if (memoizedColumns[tableName]) {
    return memoizedColumns[tableName];
  }
  try {
    const testColumns = [
      "email", "name", "status", "phone", "address", "country", 
      "streak_days", "points", "created_at", "updated_at",
      "customer_name", "city", "zip", "bank_name", "routing_number",
      "bank_account", "is_cod", "subtotal", "total", "quantity", "items", "password"
    ];
    const available: string[] = [];

    // Probe columns by selecting with a limit of 1
    for (const col of testColumns) {
      const { error } = await supabase
        .from(tableName)
        .select(col)
        .limit(1);
      
      const isMissing = error && (
        error.code === "42703" || 
        error.message.toLowerCase().includes("column") || 
        error.message.toLowerCase().includes("failed to find")
      );

      if (!isMissing) {
        available.push(col);
      }
    }
    
    // Always fallback to standard essential columns if no columns were detected or to prevent empty array
    if (available.length === 0) {
      available.push("email", "name", "status", "phone");
    }
    
    memoizedColumns[tableName] = available;
    console.log(`Auto-detected columns for table '${tableName}':`, available);
    return available;
  } catch (err: any) {
    console.warn(`Exception probing columns for ${tableName}:`, err.message);
    return ["email", "name", "status", "phone"];
  }
}

export async function filterPayload(tableName: string, payload: Record<string, any>): Promise<Record<string, any>> {
  const allowed = await getAvailableColumns(tableName);
  const filtered: Record<string, any> = {};
  for (const [key, val] of Object.entries(payload)) {
    if (allowed.includes(key)) {
      filtered[key] = val;
    }
  }
  return filtered;
}

export function getLocalPassword(email: string): string | null {
  try {
    const data = localStorage.getItem("airluxe_local_passwords");
    if (data) {
      const map = JSON.parse(data);
      return map[email.toLowerCase()] || null;
    }
  } catch (e) {
    console.warn("localStorage password read failed:", e);
  }
  return null;
}

export function saveLocalPassword(email: string, password: string) {
  try {
    const data = localStorage.getItem("airluxe_local_passwords") || "{}";
    const map = JSON.parse(data);
    map[email.toLowerCase()] = password;
    localStorage.setItem("airluxe_local_passwords", JSON.stringify(map));
  } catch (e) {
    console.warn("localStorage password write failed:", e);
  }
}

export interface AthleteProfile {
  email: string;
  name: string;
  streakDays: number;
  points: number;
  address?: string;
  phone?: string;
  country?: string;
  password?: string;
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
    const tableName = await getAthletesTable();
    const cols = await getAvailableColumns(tableName);
    
    // Auto-select only existing columns to avoid postgres errors
    const selectStr = cols.includes("email") ? cols.join(",") : "email,name,status,phone";
    
    const { data, error } = await supabase
      .from(tableName)
      .select(selectStr)
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.warn(`Supabase ${tableName} query error:`, error.message);
      return null;
    }

    if (data) {
      const row = data as any;
      return {
        email: row.email,
        name: row.name,
        streakDays: "streak_days" in row ? (row.streak_days ?? 12) : 12,
        points: "points" in row ? (row.points ?? 240) : 240,
        address: "address" in row ? (row.address || "") : "",
        phone: "phone" in row ? (row.phone || "") : "",
        country: "country" in row ? (row.country || "") : "",
        password: "password" in row ? (row.password || "") : ""
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
    const tableName = await getAthletesTable();
    const rawPayload = {
      email: profile.email.toLowerCase(),
      name: profile.name,
      streak_days: profile.streakDays,
      points: profile.points,
      status: "active",
      address: profile.address || "Not Provided",
      phone: profile.phone || "Not Provided",
      country: profile.country || "Not Provided",
      password: profile.password
    };

    const cleaned = await filterPayload(tableName, rawPayload);
    const { error } = await supabase
      .from(tableName)
      .upsert(cleaned, { onConflict: "email" });

    if (error) {
      console.warn(`Supabase upsert athlete warning on ${tableName}:`, error.message);
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
export async function syncUserRecord(
  email: string,
  name: string,
  address?: string,
  phone?: string,
  country?: string,
  password?: string
): Promise<boolean> {
  try {
    const rawPayload = {
      email: email.toLowerCase(),
      name: name,
      status: "active",
      address: address || "Not Provided",
      phone: phone || "Not Provided",
      country: country || "Not Provided",
      password: password,
      created_at: new Date().toISOString()
    };

    const cleaned = await filterPayload("users", rawPayload);
    const { error } = await supabase
      .from("users")
      .upsert(cleaned, { onConflict: "email" });

    if (error) {
      console.warn("Supabase upsert user warning:", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("Failed to sync user record:", err.message);
    return false;
  }
}

/**
 * Update full profile details including primary key email migration
 */
export async function updateFullProfile(
  oldEmail: string,
  newProfile: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
    country?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const oldEmailLower = oldEmail.toLowerCase();
    const newEmailLower = newProfile.email.toLowerCase();

    // 1. If email is changing, check if new email is already taken
    if (oldEmailLower !== newEmailLower) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", newEmailLower)
        .maybeSingle();

      if (existingUser) {
        return { success: false, error: "The new email is already in use by another account." };
      }
    }

    // 2. Fetch existing athlete details
    const existingAthlete = await getAthleteProfile(oldEmailLower);
    const streak = existingAthlete?.streakDays ?? 12;
    const pts = existingAthlete?.points ?? 240;

    const tableName = await getAthletesTable();

    // 3. Perform upserts for the new email and delete old if changing
    if (oldEmailLower !== newEmailLower) {
      if (tableName === "users") {
        // Single unified upsert if they are the same table
        const rawPayload = {
          email: newEmailLower,
          name: newProfile.name,
          streak_days: streak,
          points: pts,
          address: newProfile.address || "Not Provided",
          phone: newProfile.phone || "Not Provided",
          country: newProfile.country || "Not Provided",
          status: "active",
          created_at: new Date().toISOString()
        };
        const cleaned = await filterPayload("users", rawPayload);
        const { error: errUser } = await supabase
          .from("users")
          .upsert(cleaned);
        if (errUser) throw errUser;

        // Clean up/delete old record
        await supabase.from("users").delete().eq("email", oldEmailLower);
      } else {
        // Create new one first
        const rawUserPayload = {
          email: newEmailLower,
          name: newProfile.name,
          address: newProfile.address || "Not Provided",
          phone: newProfile.phone || "Not Provided",
          country: newProfile.country || "Not Provided",
          status: "active",
          created_at: new Date().toISOString()
        };
        const cleanedUser = await filterPayload("users", rawUserPayload);
        const { error: errUser } = await supabase
          .from("users")
          .upsert(cleanedUser);

        if (errUser) throw errUser;

        const rawAthlPayload = {
          email: newEmailLower,
          name: newProfile.name,
          streak_days: streak,
          points: pts,
          address: newProfile.address || "Not Provided",
          phone: newProfile.phone || "Not Provided",
          country: newProfile.country || "Not Provided",
          status: "active"
        };
        const cleanedAthl = await filterPayload(tableName, rawAthlPayload);
        const { error: errAthl } = await supabase
          .from(tableName)
          .upsert(cleanedAthl);

        if (errAthl) throw errAthl;

        // Clean up/delete old record
        await supabase.from("users").delete().eq("email", oldEmailLower);
        await supabase.from(tableName).delete().eq("email", oldEmailLower);
      }
    } else {
      // Just update current record
      if (tableName === "users") {
        const rawPayload = {
          name: newProfile.name,
          address: newProfile.address || "Not Provided",
          phone: newProfile.phone || "Not Provided",
          country: newProfile.country || "Not Provided"
        };
        const cleaned = await filterPayload("users", rawPayload);
        const { error: errUser } = await supabase
          .from("users")
          .update(cleaned)
          .eq("email", oldEmailLower);

        if (errUser) throw errUser;
      } else {
        const rawUserPayload = {
          name: newProfile.name,
          address: newProfile.address || "Not Provided",
          phone: newProfile.phone || "Not Provided",
          country: newProfile.country || "Not Provided"
        };
        const cleanedUser = await filterPayload("users", rawUserPayload);
        const { error: errUser } = await supabase
          .from("users")
          .update(cleanedUser)
          .eq("email", oldEmailLower);

        if (errUser) throw errUser;

        const rawAthlPayload = {
          name: newProfile.name,
          address: newProfile.address || "Not Provided",
          phone: newProfile.phone || "Not Provided",
          country: newProfile.country || "Not Provided"
        };
        const cleanedAthl = await filterPayload(tableName, rawAthlPayload);
        const { error: errAthl } = await supabase
          .from(tableName)
          .update(cleanedAthl)
          .eq("email", oldEmailLower);

        if (errAthl) throw errAthl;
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error in updateFullProfile:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Update user and athlete status (e.g. active, suspended)
 */
export async function updateUserStatus(email: string, status: string): Promise<boolean> {
  try {
    const emailLower = email.toLowerCase();
    const tableName = await getAthletesTable();
    
    if (tableName === "users") {
      const rawPayload = { status };
      const cleaned = await filterPayload("users", rawPayload);
      const { error } = await supabase
        .from("users")
        .update(cleaned)
        .eq("email", emailLower);
      if (error) {
        console.warn("Supabase update users status warning:", error.message);
      }
    } else {
      const rawUserPayload = { status };
      const cleanedUser = await filterPayload("users", rawUserPayload);
      const rawAthlPayload = { status };
      const cleanedAthl = await filterPayload(tableName, rawAthlPayload);

      const [userRes, athleteRes] = await Promise.all([
        supabase
          .from("users")
          .update(cleanedUser)
          .eq("email", emailLower),
        supabase
          .from(tableName)
          .update(cleanedAthl)
          .eq("email", emailLower)
      ]);

      if (userRes.error) {
        console.warn("Supabase update users status warning:", userRes.error.message);
      }
      if (athleteRes.error) {
        console.warn(`Supabase update ${tableName} status warning:`, athleteRes.error.message);
      }
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
    const rawPayload = {
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
    };
    const cleaned = await filterPayload("orders", rawPayload);
    const { error } = await supabase
      .from("orders")
      .insert(cleaned);

    if (error) {
      console.warn("Supabase order insert warning:", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("Failed to submit order log details:", err.message);
    return false;
  }
}
