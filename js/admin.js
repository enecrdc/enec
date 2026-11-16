function adminShowTab(name){
  document.querySelectorAll('.tab').forEach(function(t){ t.style.display='none'; });
  var el = document.getElementById('tab-'+name);
  if(el) el.style.display = 'block';
  document.querySelectorAll('.tabs button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab')===name); });
  var fn = { accueil: adminLoadAccueil, equipe: adminLoadEquipe, domaines: adminLoadDomaines, realisations: adminLoadRealisations, actualites: adminLoadActualites, programme: adminLoadProgramme, contact: adminLoadContact, settings: adminLoadSettings }[name];
  if(typeof fn === 'function'){ fn(); }
  else { var box = el ? el.querySelector('div') : null; if(box) box.innerHTML = '<p class="msg">❌ Fichier js/admin-modules.js non chargé. Vérifie que le fichier existe dans GitHub et recharge avec ?v=2</p>'; }
}
async function adminLoadAll(){
  var st = document.getElementById('sync-status');
  try{
    var r = await window.enecSupabase.from('domaines').select('id').limit(1);
    if(r.error) throw r.error;
    st.textContent = '✅ Connecté à Supabase — lecture / écriture vérifiée';
    st.className = 'sync ok';
  }catch(e){ st.textContent = '⚠️ Supabase : ' + e.message; st.className = 'sync err'; }
  adminShowTab('accueil');
}
function adminResult(elId, res, okMsg){
  var el = document.getElementById(elId);
  if(res.error){ if(el){ el.textContent = '❌ Erreur Supabase : ' + res.error.message; } alert('Erreur Supabase : ' + res.error.message); return false; }
  if(el){ el.textContent = '✅ ' + okMsg; el.className='msg ok'; }
  return true;
}
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
