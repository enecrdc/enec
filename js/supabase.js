// ENEC Supabase - connexion unique
(function(){
  if(!window.ENEC_SUPABASE_URL || window.ENEC_SUPABASE_URL.indexOf('TON_') !== -1){
    console.error('admin-config.js : URL manquante ou encore exemple');
    return;
  }
  if(!window.ENEC_SUPABASE_ANON_KEY || window.ENEC_SUPABASE_ANON_KEY.indexOf('TA_CLE') !== -1){
    console.error('admin-config.js : clé anon manquante ou encore exemple');
    return;
  }
  if(!window.supabase){
    console.error('Librairie Supabase CDN non chargée');
    return;
  }
  try{
    window.enecSupabase = window.supabase.createClient(window.ENEC_SUPABASE_URL.trim(), window.ENEC_SUPABASE_ANON_KEY.trim());
    console.log('Supabase OK :', window.ENEC_SUPABASE_URL);
  }catch(e){
    console.error('Erreur createClient :', e.message);
  }
})();
