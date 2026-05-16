const SUPABASE_URL = 'https://qgdfoshhmeigoqwaxdid.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ka0N3agUaLF_xPZkVJqRVQ_WIto7HHd';

// window.supabase is the library object from the CDN — use createClient from it
// Store our client as window.sbClient so it doesn't conflict with window.supabase (the library)
window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
