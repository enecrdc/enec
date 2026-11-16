// ENEC Supabase - connexion unique
(function(){
  if(!window.ENEC_SUPABASE_URL || !window.ENEC_SUPABASE_ANON_KEY){
    console.error('admin-config.js manquant ou incomplet');
    return;
  }
  window.enecSupabase = window.supabase.createClient(window.ENEC_SUPABASE_URL, window.ENEC_SUPABASE_ANON_KEY);
})();
