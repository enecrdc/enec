function adminShowTab(name){
  document.querySelectorAll('.tab').forEach(function(t){ t.style.display='none'; });
  var el=document.getElementById('tab-'+name);
  if(el) el.style.display='block';
  document.querySelectorAll('.tabs button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab')===name); });
  var fn={ accueil:adminLoadAccueil, equipe:adminLoadEquipe, domaines:adminLoadDomaines, realisations:adminLoadRealisations, actualites:adminLoadActualites, programme:adminLoadProgramme, contact:adminLoadContact, settings:adminLoadSettings, textes:adminLoadTextes, galerie:adminLoadGalerie, videos:adminLoadVideos }[name];
  if(typeof fn==='function'){ fn(); }
  else { var box=el?el.querySelector('div'):null; if(box) box.innerHTML='<p class="msg">❌ Fichier js/admin-modules.js non chargé.</p>'; }
}
async function adminLoadAll(){
  var st=document.getElementById('sync-status');
  try{
    var r=await window.enecSupabase.from('domaines').select('id').limit(1);
    if(r.error) throw r.error;
    st.textContent='✅ Connecté à Supabase — lecture / écriture vérifiée';
    st.className='sync ok';
  }catch(e){ st.textContent='⚠️ Supabase : '+e.message; st.className='sync err'; }
  adminShowTab('accueil');
}
function adminResult(elId,res,okMsg){
  var el=document.getElementById(elId);
  if(res.error){ if(el) el.textContent='❌ Erreur Supabase : '+res.error.message; alert('Erreur Supabase : '+res.error.message); return false; }
  if(el){ el.textContent='✅ '+okMsg; el.className='msg ok'; }
  return true;
}
async function adminUploadImage(inputId){
  var input=document.getElementById(inputId);
  if(!input || !input.files || !input.files[0]) return null;
  var file=input.files[0];
  var ext=file.name.split('.').pop().toLowerCase();
  var name='img-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
  var up=await window.enecSupabase.storage.from('enec-images').upload(name,file,{upsert:true,contentType:file.type});
  if(up.error) throw up.error;
  return window.enecSupabase.storage.from('enec-images').getPublicUrl(name).data.publicUrl;
}
// Optimise la photo : redimensionne à 1200px max + convertit en WebP pour économiser le stockage
async function adminUploadOneOptimized(file){
  if(!file) return null;
  var bitmap=await createImageBitmap(file);
  var max=1200; var w=bitmap.width, h=bitmap.height;
  if(w>max){ h=Math.round(h*max/w); w=max; }
  var canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
  canvas.getContext('2d').drawImage(bitmap,0,0,w,h);
  var blob=await new Promise(function(res){ canvas.toBlob(res,'image/webp',0.82); });
  var name='img-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.webp';
  var up=await window.enecSupabase.storage.from('enec-images').upload(name,blob,{upsert:true,contentType:'image/webp'});
  if(up.error) throw up.error;
  return window.enecSupabase.storage.from('enec-images').getPublicUrl(name).data.publicUrl;
}
async function adminUploadImageOptimized(inputId){
  var input=document.getElementById(inputId);
  if(!input || !input.files || !input.files[0]) return null;
  return adminUploadOneOptimized(input.files[0]);
}
async function adminUploadOneOptimized(file){
  if(!file) return null;
  var bitmap=await createImageBitmap(file);
  var max=1200; var w=bitmap.width, h=bitmap.height;
  if(w>max){ h=Math.round(h*max/w); w=max; }
  var canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
  canvas.getContext('2d').drawImage(bitmap,0,0,w,h);
  var blob=await new Promise(function(res){ canvas.toBlob(res,'image/webp',0.82); });
  var name='img-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.webp';
  var up=await window.enecSupabase.storage.from('enec-images').upload(name,blob,{upsert:true,contentType:'image/webp'});
  if(up.error) throw up.error;
  return window.enecSupabase.storage.from('enec-images').getPublicUrl(name).data.publicUrl;
}
async function adminUploadImageOptimized(inputId){
  var input=document.getElementById(inputId);
  if(!input || !input.files || !input.files[0]) return null;
  return adminUploadOneOptimized(input.files[0]);
}
