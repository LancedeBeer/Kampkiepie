// lib/supabase-client.js
// Supabase URL and anon key are intentionally public —
// Row Level Security controls what data is accessible.

const SUPABASE_URL      = 'https://vgqxaubluvqjbvzgsvze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncXhhdWJsdXZxamJ2emdzdnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MDI5MzEsImV4cCI6MjEwNDk3ODkzMX0.YSrWrmIREgwYXdW2l6OVbegsymxNC8yHO6uMePFTSoo';

let _client = null;

export function getSupabase() {
  if (!_client) {
    _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _client;
}