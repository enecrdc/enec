// ENEC - Connexion Supabase UNIQUE pour site public + admin
// Ce fichier crée window.enecSupabase. Sans lui, l'admin dit "Cannot read properties of undefined (reading 'auth')"

(function(){
  // 1. Récupère la config depuis admin-config.js, peu importe son nom
  var cfg = window.ENEC_CONFIG || window.SUPABASE_CONFIG || window.CONFIG || {};
  var url = cfg.SUPABASE_URL || cfg.supabaseUrl || cfg.url || window.SUPABASE_URL || '';
  var key = cfg.SUPABASE_ANON_KEY || cfg.supabaseAnonKey || cfg.anonKey || cfg.key || window.SUPABASE_ANON_KEY || '';

  // 2. Si pas de config, on s'arrête proprement avec un message clair
  if(!url || !key){
    console.error('ENEC: admin-config.js vide ou introuvable. Mets SUPABASE_URL et SUPABASE_ANON_KEY dedans.');
    window.enecSupabase = null;
    window.enecSupabaseError = 'admin-config.js vide ou introuvable';
    return;
  }

  // 3. Crée le client Supabase
  try{
    var client = window.supabase.createClient(url, key);
    window.enecSupabase = client;
    // Alias pour compatibilité avec les anciens fichiers
    window.supabaseClient = client;
    console.log('ENEC: Supabase connecté', url);
  }catch(e){
    console.error('ENEC: Erreur création client Supabase', e);
    window.enecSupabase = null;
    window.enecSupabaseError = e.message;
  }
})();
