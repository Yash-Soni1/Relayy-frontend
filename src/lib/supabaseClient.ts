import { createClient } from "@supabase/supabase-js";

// Directly paste your Supabase project details here
const SUPABASE_URL = "https://mrflauftglbwqiwfimjx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZmxhdWZ0Z2xid3Fpd2ZpbWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzODEwMTEsImV4cCI6MjA3Mzk1NzAxMX0.OEgg1GBbvY_8mqTkEkkA5xpQLPohIn3645RBAHvR0gE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
