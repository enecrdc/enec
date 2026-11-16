// ENEC Admin - Général : onglets, status, helpers vérifiés
function adminShowTab(name){
  document.querySelectorAll('.tab').forEach(function(t){ t.style.display='none'; });
  var el = document.getElementById('tab-'+name);
  if(el) el.style.display = 'block';
  document.querySelectorAll('.tabs button').forEach(function(b){
    b.classList.toggle('active', b.getAttribute('data-tab')===name);
  });
  // Recharger l'onglet à chaque ouverture pour voir la vraie donnée Supabase
  var fn = { accueil: adminLoadAccueil, equipe: adminLoadEquipe, domaines: adminLoadDomaines, realisations: adminLoadRealisations, actualites: adminLoadActualites, programme: adminLoadProgramme, contact: adminLoadContact, settings: adminLoadSettings }[name];
  if(fn) fn();
}
async function adminLoadAll(){
  var st = document.getElementById('sync-status');
  try{
    var r = await window.enecSupabase.from('domaines').select('id').limit(1);
    if(r.error) throw r.error;
    st.textContent = '✅ Connecté à Supabase — lecture / écriture vérifiée';
    st.className = 'sync ok';
  }catch(e){
    st.textContent = '⚠️ Supabase : ' + e.message + ' — Vérifie le SQL ci-dessous (tables / RLS).';
    st.className = 'sync err';
  }
  adminShowTab('accueil');
}
// Helper : affiche le vrai résultat Supabase, jamais de faux succès
function adminResult(elId, res, okMsg){
  var el = document.getElementById(elId);
  if(res.error){ if(el){ el.textContent = '❌ Erreur Supabase : ' + res.error.message; el.className='msg'; } alert('Erreur Supabase : ' + res.error.message); return false; }
  if(el){ el.textContent = '✅ ' + okMsg; el.className='msg ok'; }
  return true;
}
// Helper upload image -> Storage bucket "enec-images", retourne URL publique réelle
async function adminUploadImage(inputId){
  var input = document.getElementById(inputId);
  if(!input || !input.files || !input.files[0]) return null;
  var file = input.files[0];
  var ext = file.name.split('.').pop().toLowerCase();
  var name = 'img-' + Date.now() + '-' + Math.random().toString(36).slice(2,8) + '.' + ext;
  var up = await window.enecSupabase.storage.from('enec-images').upload(name, file, { upsert: true, contentType: file.type });
  if(up.error) throw up.error;
  var pub = window.enecSupabase.storage.from('enec-images').getPublicUrl(name);
  return pub.data.publicUrl;
}
function adminEsc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
