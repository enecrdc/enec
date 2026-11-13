// ENEC — Admin + Supabase (greffé sur index.html compilé, sans toucher à la vitrine React)
let enecSb=null, enecIsSb=false, enecDemo=false;
(function(){try{const u=window.ENEC_SUPABASE_URL,k=window.ENEC_SUPABASE_ANON_KEY;if(u&&k&&!u.includes('TON-PROJET')&&!k.includes('TA-CLE')&&window.supabase){enecSb=window.supabase.createClient(u,k);enecIsSb=true;}}catch(e){console.warn('Supabase non configuré, mode démo',e)}})();
function enecTab(n,btn){document.querySelectorAll('.enec-tabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');['services','laureats','messages','settings'].forEach(t=>document.getElementById('enec-tab-'+t).style.display=(t===n?'block':'none'));if(n==='messages')enecLoadMessages();}
async function enecLogin(){const email=document.getElementById('enec-email').value.trim(),pass=document.getElementById('enec-pass').value;
 if(enecIsSb){const{error}=await enecSb.auth.signInWithPassword({email,password:pass});if(error){document.getElementById('enec-login-status').textContent='❌ '+error.message;return;}}
 else if(!(email==='admin@enec.cd'&&pass==='enec2026')){document.getElementById('enec-login-status').textContent='❌ Démo : admin@enec.cd / enec2026';return;}
 else enecDemo=true;
 document.getElementById('enec-login').style.display='none';document.getElementById('enec-dash').style.display='block';
 document.getElementById('enec-who').textContent='Connecté : '+email+(enecDemo?' • MODE DÉMO':' • Supabase');
 enecLoadLists();}
async function enecLogout(){if(enecIsSb)await enecSb.auth.signOut();enecDemo=false;document.getElementById('enec-dash').style.display='none';document.getElementById('enec-login').style.display='block';}
async function enecLoadLists(){let s=[],l=[];
 if(enecIsSb){const a=await enecSb.from('services').select('*').order('ordre');if(a.data)s=a.data;const b=await enecSb.from('laureats').select('*').order('created_at',{ascending:false});if(b.data)l=b.data;}
 else{s=JSON.parse(localStorage.getItem('enec_demo_services')||'[]');l=JSON.parse(localStorage.getItem('enec_demo_laureats')||'[]');}
 document.getElementById('enec-admin-services').innerHTML='<h4>Services enregistrés</h4>'+(s.length?s.map(x=>`<div class="enec-row"><b>${x.icone||'✦'} ${x.titre}</b><br>${x.description||''} ${x.id?`<button onclick="enecDelete('services',${x.id})">Supprimer</button>`:''}</div>`).join(''):'<p>Aucun — exécute supabase-schema.sql pour voir les 9 services par défaut.</p>');
 document.getElementById('enec-admin-laureats').innerHTML='<h4>Lauréats enregistrés</h4>'+(l.length?l.map(x=>`<div class="enec-row"><b>${x.nom}</b> — ${x.legende||''} ${x.id?`<button onclick="enecDelete('laureats',${x.id})">Supprimer</button>`:''}</div>`).join(''):'<p>Aucun lauréat pour le moment.</p>');}
async function enecDelete(table,id){if(enecIsSb){await enecSb.from(table).delete().eq('id',id);}enecLoadLists();}
async function enecSaveService(){const titre=document.getElementById('enec-s-titre').value.trim(),description=document.getElementById('enec-s-desc').value.trim(),icone=document.getElementById('enec-s-icon').value||'✦';if(!titre||!description){document.getElementById('enec-s-status').textContent='❌ Titre + description requis';return;}
 if(enecIsSb){const{error}=await enecSb.from('services').insert({titre,description,icone,actif:true});if(error){document.getElementById('enec-s-status').textContent='❌ '+error.message;return;}}
 else{const a=JSON.parse(localStorage.getItem('enec_demo_services')||'[]');a.push({titre,description,icone});localStorage.setItem('enec_demo_services',JSON.stringify(a));}
 document.getElementById('enec-s-status').textContent='✅ Service enregistré';enecLoadLists();}
async function enecSaveLaureat(){const nom=document.getElementById('enec-l-nom').value.trim(),legende=document.getElementById('enec-l-legende').value.trim()||'Lauréats de la formation en anglais – EETC',photo_url=document.getElementById('enec-l-photo').value.trim();if(!nom){document.getElementById('enec-l-status').textContent='❌ Nom requis';return;}
 if(enecIsSb){const{error}=await enecSb.from('laureats').insert({nom,legende,photo_url:photo_url||null});if(error){document.getElementById('enec-l-status').textContent='❌ '+error.message;return;}}
 else{const a=JSON.parse(localStorage.getItem('enec_demo_laureats')||'[]');a.unshift({nom,legende,photo_url});localStorage.setItem('enec_demo_laureats',JSON.stringify(a));}
 document.getElementById('enec-l-status').textContent='✅ Lauréat ajouté';enecLoadLists();}
// À appeler depuis le formulaire Contact de la vitrine pour enregistrer le message :
async function enecSendMessage(payload){if(enecIsSb){const{error}=await enecSb.from('messages').insert(payload);return !error;}const m=JSON.parse(localStorage.getItem('enec_demo_messages')||'[]');m.unshift({...payload,created_at:new Date().toISOString()});localStorage.setItem('enec_demo_messages',JSON.stringify(m));return true;}
async function enecLoadMessages(){let m=[];if(enecIsSb){const{data}=await enecSb.from('messages').select('*').order('created_at',{ascending:false}).limit(50);if(data)m=data;}else{m=JSON.parse(localStorage.getItem('enec_demo_messages')||'[]');}
 document.getElementById('enec-admin-messages').innerHTML=m.length?m.map(x=>`<div class="enec-row"><b>${x.nom||''}</b> • ${x.service||''} • ${x.telephone||''} • ${x.email||''}<br>${x.message||''}<br><small>${x.created_at||''}</small></div>`).join(''):'<p>Aucun message.</p>';}
async function enecSaveSettings(){const telephone=document.getElementById('enec-p-tel').value,email=document.getElementById('enec-p-email').value,adresse=document.getElementById('enec-p-adresse').value;if(enecIsSb){const{error}=await enecSb.from('settings').upsert({id:1,telephone,email,adresse});document.getElementById('enec-p-status').textContent=error?'❌ '+error.message:'✅ Paramètres enregistrés dans Supabase';}else{document.getElementById('enec-p-status').textContent='✅ Démo : connecte Supabase pour sauvegarder vraiment.';}}
