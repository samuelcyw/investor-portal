/* eslint-env node */
import process from "node:process";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kmvxpnxyuzmupynnhlvl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ users: data.users });
}
