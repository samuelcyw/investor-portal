import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kmvxpnxyuzmupynnhlvl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imttdnhwbnh5dXptdXB5bm5obHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjI3MTEsImV4cCI6MjA2ODMzODcxMX0.cF27C48LhAKLMF__Jzg-J16RI9wbOULl82f-ddP4k_A"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
