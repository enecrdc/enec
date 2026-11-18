// ============================================
// ENEC - CONFIGURATION SUPABASE
// Tu modifies SEULEMENT les 2 lignes ci-dessous
// ============================================

// 👉 LIGNE 1 : Colle ici ton SUPABASE URL
// Où le trouver ? Supabase > Settings > API > Project URL
window.ENEC_SUPABASE_URL = "https://mlzacyrgnmentvilwvkm.supabase.co";

// 👉 LIGNE 2 : Colle ici ta clé ANON PUBLIC
// Où la trouver ? Supabase > Settings > API > anon public
// ⚠️ Jamais la clé "service_role" ici !
window.ENEC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1semFjeXJnbm1lbnR2aWx3dmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MDA2NzMsImV4cCI6MjExMDE3NjY3M30.RO1EmPo3hpm9ceb5U0-ZeeG1Uv1XePnOzZ7tmPix26w";

// ============================================
// NE TOUCHE À RIEN EN DESSOUS
// ============================================

// Nom du dossier pour les images
window.ENEC_SUPABASE_BUCKET = "enec-images";

// Connexion à Supabase (utilisée par admin.html et index.html)
function enecSupabaseClient() {
  if (!window.supabase) {
    throw new Error("SDK Supabase non chargé.");
  }

  if (!window.__enec_sb) {
    window.__enec_sb = window.supabase.createClient(
      window.ENEC_SUPABASE_URL,
      window.ENEC_SUPABASE_ANON_KEY
    );
  }

  return window.__enec_sb;
}
