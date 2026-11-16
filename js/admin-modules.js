function adminEsc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ACCUEIL
async function adminLoadAccueil(){
  var box=document.getElementById('accueil-form'); if(!box) return; box.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('accueil').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML='<p class="msg">Table accueil : '+adminEsc(r.error.message)+'</p>'; return; }
  var d=r.data||{}; box.innerHTML='<label>Titre</label><input id="acc_titre" value="'+adminEsc(d.titre||'Un nouvel espoir, de multiples opportunités !')+'"><label>Texte</label><textarea id="acc_texte">'+adminEsc(d.texte||'')+'</textarea><button onclick="adminSaveAccueil()">Enregistrer</button><p id="acc_msg" class="msg"></p>';
}
async function adminSaveAccueil(){ var p={titre:document.getElementById('acc_titre').value,texte:document.getElementById('acc_texte').value}; var cur=await window.enecSupabase.from('accueil').select('id').limit(1).maybeSingle(); var res=cur.data?await window.enecSupabase.from('accueil').update(p).eq('id',cur.data.id).select():await window.enecSupabase.from('accueil').insert([p]).select(); adminResult('acc_msg',res,'Accueil enregistré.'); }

// EQUIPE
async function adminLoadEquipe(){
  var list=document.getElementById('equipe-list'); if(!list) return; list.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('equipe').select('*').order('ordre',{ascending:true});
  if(r.error){ list.innerHTML='<p class="msg">Table equipe : '+adminEsc(r.error.message)+'</p>'; return; }
  var data=r.data||[];
  list.innerHTML=data.length===0?'<p>Aucun membre. Ajoute-en un ci-dessous.</p>':data.map(function(m){ return '<div class="item" style="border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:10px"><div style="display:flex;gap:12px;align-items:center">'+(m.photo?'<img src="'+adminEsc(m.photo)+'" style="width:70px;height:70px;object-fit:cover;border-radius:50%">':'<div style="width:70px;height:70px;background:#eee;border-radius:50%;display:flex;align-items:center;justify-content:center">👤</div>')+'<div><b>'+adminEsc(m.nom)+'</b><br><span>'+adminEsc(m.role||'')+'</span></div></div><p>'+adminEsc(m.bio||'')+'</p><button class="small" onclick="adminEditMembre(\''+m.id+'\')">✏️ Modifier</button> <button class="small" onclick="adminEditMembre(\''+m.id+'\')">🖼️ Changer photo</button> <button class="small danger" onclick="adminDeleteMembre(\''+m.id+'\')">🗑️ Supprimer</button></div>'; }).join('');
  document.getElementById('equipe-form').innerHTML='<h3>Ajouter / Modifier un membre</h3><input id="eq_id" type="hidden"><input id="eq_nom" placeholder="Nom complet"><input id="eq_role" placeholder="Rôle"><textarea id="eq_bio" placeholder="Bio"></textarea><label>Photo</label><input id="eq_photo" type="file" accept="image/*"><input id="eq_ordre" type="number" placeholder="Ordre"><button onclick="adminSaveMembre()">✅ Enregistrer ce membre</button><p id="eq_msg" class="msg"></p>';
}
async function adminSaveMembre(){ try{ var photo=await adminUploadImage('eq_photo'); var p={nom:document.getElementById('eq_nom').value,role:document.getElementById('eq_role').value,bio:document.getElementById('eq_bio').value,ordre:parseInt(document.getElementById('eq_ordre').value||'99'),actif:true}; if(photo) p.photo=photo; if(!p.nom){ alert('Nom obligatoire'); return; } var id=document.getElementById('eq_id').value; var res=id?await window.enecSupabase.from('equipe').update(p).eq('id',id).select():await window.enecSupabase.from('equipe').insert([p]).select(); if(adminResult('eq_msg',res,'Membre enregistré.')) adminLoadEquipe(); }catch(e){ document.getElementById('eq_msg').textContent='❌ '+e.message; } }
async function adminEditMembre(id){ var r=await window.enecSupabase.from('equipe').select('*').eq('id',id).single(); if(!r.error){ document.getElementById('eq_id').value=r.data.id; document.getElementById('eq_nom').value=r.data.nom||''; document.getElementById('eq_role').value=r.data.role||''; document.getElementById('eq_bio').value=r.data.bio||''; document.getElementById('eq_ordre').value=r.data.ordre||''; window.scrollTo({top:document.getElementById('equipe-form').offsetTop,behavior:'smooth'}); } }
async function adminDeleteMembre(id){ if(!confirm('Supprimer ce membre ?')) return; var res=await window.enecSupabase.from('equipe').delete().eq('id',id); if(!res.error) adminLoadEquipe(); else alert(res.error.message); }

// DOMAINES
async function adminLoadDomaines(){
  var list=document.getElementById('domaines-list'); if(!list) return; list.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('domaines').select('*').order('ordre',{ascending:true});
  if(r.error){ list.innerHTML='<p class="msg">Table domaines : '+adminEsc(r.error.message)+'</p>'; return; }
  var data=r.data||[]; list.innerHTML=data.length===0?'<p>Aucun domaine.</p>':data.map(function(d){ return '<div class="item" style="border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:10px"><b>'+adminEsc(d.icone||'')+' '+adminEsc(d.titre)+'</b> '+(d.actif===false?'<span>— DÉPUBLIÉ</span>':'<span>— Publié</span>')+'<p>'+adminEsc(d.description||'')+'</p><button class="small" onclick="adminEditDomaine(\''+d.id+'\')">✏️ Modifier</button> <button class="small" onclick="adminToggleDomaine(\''+d.id+'\','+(d.actif===false?'true':'false')+')">'+(d.actif===false?'✅ Publier':'⏸️ Dépublier')+'</button> <button class="small danger" onclick="adminDeleteDomaine(\''+d.id+'\')">🗑️ Supprimer</button></div>'; }).join('');
  document.getElementById('domaines-form').innerHTML='<h3>Ajouter / Modifier un domaine</h3><input id="dom_id" type="hidden"><input id="dom_titre" placeholder="Titre — ex : 🐟 Pisciculture"><textarea id="dom_desc" placeholder="Description"></textarea><input id="dom_icone" placeholder="Icône — ex : 🐟"><input id="dom_ordre" type="number" placeholder="Ordre"><button onclick="adminSaveDomaine()">✅ Enregistrer ce domaine</button><p id="dom_msg" class="msg"></p>';
}
async function adminSaveDomaine(){ var id=document.getElementById('dom_id').value; var p={titre:document.getElementById('dom_titre').value,description:document.getElementById('dom_desc').value,icone:document.getElementById('dom_icone').value,ordre:parseInt(document.getElementById('dom_ordre').value||'99'),actif:true}; if(!p.titre){ alert('Titre obligatoire'); return; } var res=id?await window.enecSupabase.from('domaines').update(p).eq('id',id).select():await window.enecSupabase.from('domaines').insert([p]).select(); if(adminResult('dom_msg',res,'Domaine enregistré.')) adminLoadDomaines(); }
async function adminEditDomaine(id){ var r=await window.enecSupabase.from('domaines').select('*').eq('id',id).single(); if(!r.error){ document.getElementById('dom_id').value=r.data.id; document.getElementById('dom_titre').value=r.data.titre||''; document.getElementById('dom_desc').value=r.data.description||''; document.getElementById('dom_icone').value=r.data.icone||''; document.getElementById('dom_ordre').value=r.data.ordre||''; } }
async function adminToggleDomaine(id,v){ var res=await window.enecSupabase.from('domaines').update({actif:v}).eq('id',id).select(); if(!res.error) adminLoadDomaines(); else alert(res.error.message); }
async function adminDeleteDomaine(id){ if(!confirm('Supprimer ce domaine ?')) return; var res=await window.enecSupabase.from('domaines').delete().eq('id',id); if(!res.error) adminLoadDomaines(); else alert(res.error.message); }

// REALISATIONS
async function adminLoadRealisations(){
  var list=document.getElementById('realisations-list'); if(!list) return; list.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('realisations').select('*').order('ordre',{ascending:true});
  if(r.error){ list.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  list.innerHTML=(r.data||[]).map(function(x){ return '<div class="item" style="border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:10px"><b>'+adminEsc(x.titre)+'</b><p>'+adminEsc(x.description||'')+'</p>'+(x.image?'<img src="'+adminEsc(x.image)+'" style="width:100%;max-height:180px;object-fit:cover;border-radius:8px">':'')+'<br><button class="small" onclick="adminEditReal(\''+x.id+'\')">✏️ Modifier</button> <button class="small danger" onclick="adminDeleteReal(\''+x.id+'\')">🗑️ Supprimer</button></div>'; }).join('')||'<p>Aucune réalisation.</p>';
  document.getElementById('realisations-form').innerHTML='<h3>Ajouter / Modifier</h3><input id="re_id" type="hidden"><input id="re_titre" placeholder="Titre"><textarea id="re_desc" placeholder="Description"></textarea><input id="re_image" type="file" accept="image/*"><button onclick="adminSaveReal()">✅ Enregistrer</button><p id="re_msg" class="msg"></p>';
}
async function adminSaveReal(){ try{ var img=await adminUploadImage('re_image'); var p={titre:document.getElementById('re_titre').value,description:document.getElementById('re_desc').value,actif:true}; if(img) p.image=img; var id=document.getElementById('re_id').value; var res=id?await window.enecSupabase.from('realisations').update(p).eq('id',id).select():await window.enecSupabase.from('realisations').insert([p]).select(); if(adminResult('re_msg',res,'Réalisation enregistrée.')) adminLoadRealisations(); }catch(e){ document.getElementById('re_msg').textContent='❌ '+e.message; } }
async function adminEditReal(id){ var r=await window.enecSupabase.from('realisations').select('*').eq('id',id).single(); if(!r.error){ document.getElementById('re_id').value=r.data.id; document.getElementById('re_titre').value=r.data.titre||''; document.getElementById('re_desc').value=r.data.description||''; } }
async function adminDeleteReal(id){ if(!confirm('Supprimer ?')) return; var res=await window.enecSupabase.from('realisations').delete().eq('id',id); if(!res.error) adminLoadRealisations(); else alert(res.error.message); }

// ACTUALITES
async function adminLoadActualites(){
  var list=document.getElementById('actualites-list'); if(!list) return; list.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('actualites').select('*').order('created_at',{ascending:false});
  if(r.error){ list.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  list.innerHTML=(r.data||[]).map(function(x){ return '<div class="item" style="border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:10px"><b>'+adminEsc(x.titre)+'</b> '+(x.publie?'— Publié':'— Brouillon')+'<p>'+adminEsc(x.contenu||'')+'</p>'+(x.image?'<img src="'+adminEsc(x.image)+'" style="width:100%;max-height:180px;object-fit:cover;border-radius:8px">':'')+'<br><button class="small" onclick="adminToggleActu(\''+x.id+'\','+(x.publie?'false':'true')+')">'+(x.publie?'⏸️ Dépublier':'✅ Publier')+'</button> <button class="small danger" onclick="adminDeleteActu(\''+x.id+'\')">🗑️ Supprimer</button></div>'; }).join('')||'<p>Aucune actualité.</p>';
  document.getElementById('actualites-form').innerHTML='<h3>Publier un article</h3><input id="ac_titre" placeholder="Titre"><textarea id="ac_contenu" placeholder="Contenu"></textarea><input id="ac_image" type="file" accept="image/*"><button onclick="adminSaveActu()">✅ Publier</button><p id="ac_msg" class="msg"></p>';
}
async function adminSaveActu(){ try{ var img=await adminUploadImage('ac_image'); var p={titre:document.getElementById('ac_titre').value,contenu:document.getElementById('ac_contenu').value,publie:true}; if(img) p.image=img; var res=await window.enecSupabase.from('actualites').insert([p]).select(); if(adminResult('ac_msg',res,'Article publié.')) adminLoadActualites(); }catch(e){ document.getElementById('ac_msg').textContent='❌ '+e.message; } }
async function adminToggleActu(id,v){ var res=await window.enecSupabase.from('actualites').update({publie:v}).eq('id',id).select(); if(!res.error) adminLoadActualites(); else alert(res.error.message); }
async function adminDeleteActu(id){ if(!confirm('Supprimer ?')) return; var res=await window.enecSupabase.from('actualites').delete().eq('id',id); if(!res.error) adminLoadActualites(); else alert(res.error.message); }
// PROGRAMME
async function adminLoadProgramme(){
  var box=document.getElementById('programme-form'); if(!box) return; box.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('programme').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  var d=r.data||{}; box.innerHTML='<input id="pr_titre" value="'+adminEsc(d.titre||'Programme d\'Appui aux Entrepreneurs')+'"><textarea id="pr_desc">'+adminEsc(d.description||'')+'</textarea><button onclick="adminSaveProgramme()">Enregistrer</button><p id="pr_msg" class="msg"></p>';
}
async function adminSaveProgramme(){ var p={titre:document.getElementById('pr_titre').value,description:document.getElementById('pr_desc').value,actif:true}; var cur=await window.enecSupabase.from('programme').select('id').limit(1).maybeSingle(); var res=cur.data?await window.enecSupabase.from('programme').update(p).eq('id',cur.data.id).select():await window.enecSupabase.from('programme').insert([p]).select(); adminResult('pr_msg',res,'Programme enregistré.'); }

// CONTACT
async function adminLoadContact(){
  var box=document.getElementById('contact-form'); if(!box) return; box.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('contact').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  var d=r.data||{}; box.innerHTML='<input id="ct_adresse" value="'+adminEsc(d.adresse||'Avenue de la Bière, Ibanda, Bukavu')+'"><input id="ct_tel" value="'+adminEsc(d.telephone||'+243 970 204 871')+'"><input id="ct_email" value="'+adminEsc(d.email||'enecbusiness20@gmail.com')+'"><input id="ct_horaires" value="'+adminEsc(d.horaires||'Lun - Ven : 08h00 - 17h00')+'"><button onclick="adminSaveContact()">Enregistrer</button><p id="ct_msg" class="msg"></p>';
  var m=await window.enecSupabase.from('messages').select('*').order('created_at',{ascending:false}).limit(20);
  document.getElementById('messages-list').innerHTML='<h3>Messages reçus</h3>'+((m.data||[]).map(function(x){ return '<div class="item"><b>'+adminEsc(x.nom||'')+'</b> — '+adminEsc(x.email||'')+'<p>'+adminEsc(x.message||'')+'</p></div>'; }).join('')||'<p>Aucun message.</p>');
}
async function adminSaveContact(){ var p={adresse:document.getElementById('ct_adresse').value,telephone:document.getElementById('ct_tel').value,email:document.getElementById('ct_email').value,horaires:document.getElementById('ct_horaires').value}; var cur=await window.enecSupabase.from('contact').select('id').limit(1).maybeSingle(); var res=cur.data?await window.enecSupabase.from('contact').update(p).eq('id',cur.data.id).select():await window.enecSupabase.from('contact').insert([p]).select(); adminResult('ct_msg',res,'Contact enregistré.'); }

// SETTINGS
async function adminLoadSettings(){
  var box=document.getElementById('settings-form'); if(!box) return; box.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('settings').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  var d=r.data||{}; box.innerHTML='<input id="st_nom" value="'+adminEsc(d.nom_site||'ENEC')+'"><input id="st_slogan" value="'+adminEsc(d.slogan||'Un nouvel espoir, de multiples opportunités !')+'"><input id="st_whatsapp" value="'+adminEsc(d.whatsapp||'+243970204871')+'"><button onclick="adminSaveSettings()">Enregistrer</button><p id="st_msg" class="msg"></p>';
}
async function adminSaveSettings(){ var p={nom_site:document.getElementById('st_nom').value,slogan:document.getElementById('st_slogan').value,whatsapp:document.getElementById('st_whatsapp').value}; var cur=await window.enecSupabase.from('settings').select('id').limit(1).maybeSingle(); var res=cur.data?await window.enecSupabase.from('settings').update(p).eq('id',cur.data.id).select():await window.enecSupabase.from('settings').insert([p]).select(); adminResult('st_msg',res,'Paramètres enregistrés.'); }

// TEXTES DU SITE
async function adminLoadTextes(){
  var box=document.getElementById('textes-list'); if(!box) return; box.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('textes_site').select('*').order('cle',{ascending:true});
  if(r.error){ box.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  box.innerHTML=(r.data||[]).map(function(t){ return '<div class="item" style="border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:10px"><b>'+adminEsc(t.cle)+'</b><br><label>Titre</label><input id="tx_titre_'+t.id+'" value="'+adminEsc(t.titre||'')+'"><label>Texte</label><textarea id="tx_contenu_'+t.id+'">'+adminEsc(t.contenu||'')+'</textarea><button onclick="adminSaveTexte(\''+t.id+'\')">✅ Enregistrer ce texte</button> <button class="small danger" onclick="adminDeleteTexte(\''+t.id+'\')">🗑️ Supprimer</button><p id="tx_msg_'+t.id+'" class="msg"></p></div>'; }).join('')+'<h3>Ajouter un nouveau texte</h3><input id="tx_new_cle" placeholder="Clé — ex : mission"><input id="tx_new_titre" placeholder="Titre"><textarea id="tx_new_contenu" placeholder="Texte"></textarea><button onclick="adminAddTexte()">➕ Ajouter ce texte</button><p id="tx_new_msg" class="msg"></p>';
}
async function adminSaveTexte(id){ var p={titre:document.getElementById('tx_titre_'+id).value,contenu:document.getElementById('tx_contenu_'+id).value}; var res=await window.enecSupabase.from('textes_site').update(p).eq('id',id).select(); adminResult('tx_msg_'+id,res,'Texte enregistré.'); }
async function adminDeleteTexte(id){ if(!confirm('Supprimer ce texte ?')) return; var res=await window.enecSupabase.from('textes_site').delete().eq('id',id); if(!res.error) adminLoadTextes(); else alert(res.error.message); }
async function adminAddTexte(){ var p={cle:document.getElementById('tx_new_cle').value,titre:document.getElementById('tx_new_titre').value,contenu:document.getElementById('tx_new_contenu').value}; if(!p.cle){ alert('Clé obligatoire'); return; } var res=await window.enecSupabase.from('textes_site').insert([p]).select(); if(adminResult('tx_new_msg',res,'Texte ajouté.')) adminLoadTextes(); }

// GALERIE PHOTOS
async function adminLoadGalerie(){
  var list=document.getElementById('galerie-list'); if(!list) return; list.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('galerie').select('*').order('ordre',{ascending:true});
  if(r.error){ list.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  list.innerHTML=(r.data||[]).map(function(g){ return '<div class="item" style="border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:10px">'+(g.image?'<img src="'+adminEsc(g.image)+'" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px">':'<p>Pas de photo</p>')+'<b>'+adminEsc(g.titre||'')+'</b><p>'+adminEsc(g.description||'')+'</p><button class="small" onclick="adminEditGalerie(\''+g.id+'\')">✏️ Modifier</button> <button class="small" onclick="adminToggleGalerie(\''+g.id+'\','+(g.actif===false?'true':'false')+')">'+(g.actif===false?'✅ Publier':'⏸️ Dépublier')+'</button> <button class="small danger" onclick="adminDeleteGalerie(\''+g.id+'\')">🗑️ Supprimer</button></div>'; }).join('')||'<p>Aucune photo. Ajoute-en une ci-dessous.</p>';
  document.getElementById('galerie-form').innerHTML='<h3>Ajouter / Modifier une photo</h3><input id="ga_id" type="hidden"><input id="ga_titre" placeholder="Titre de la photo"><textarea id="ga_desc" placeholder="Description"></textarea><label>Photo</label><input id="ga_image" type="file" accept="image/*"><input id="ga_ordre" type="number" placeholder="Ordre"><button onclick="adminSaveGalerie()">✅ Enregistrer cette photo</button><p id="ga_msg" class="msg"></p>';
}
async function adminSaveGalerie(){ try{ var img=await adminUploadImage('ga_image'); var p={titre:document.getElementById('ga_titre').value,description:document.getElementById('ga_desc').value,ordre:parseInt(document.getElementById('ga_ordre').value||'99'),actif:true}; if(img) p.image=img; var id=document.getElementById('ga_id').value; var res=id?await window.enecSupabase.from('galerie').update(p).eq('id',id).select():await window.enecSupabase.from('galerie').insert([p]).select(); if(adminResult('ga_msg',res,'Photo enregistrée.')) adminLoadGalerie(); }catch(e){ document.getElementById('ga_msg').textContent='❌ '+e.message; } }
async function adminEditGalerie(id){ var r=await window.enecSupabase.from('galerie').select('*').eq('id',id).single(); if(!r.error){ document.getElementById('ga_id').value=r.data.id; document.getElementById('ga_titre').value=r.data.titre||''; document.getElementById('ga_desc').value=r.data.description||''; document.getElementById('ga_ordre').value=r.data.ordre||''; } }
async function adminToggleGalerie(id,v){ var res=await window.enecSupabase.from('galerie').update({actif:v}).eq('id',id).select(); if(!res.error) adminLoadGalerie(); else alert(res.error.message); }
async function adminDeleteGalerie(id){ if(!confirm('Supprimer cette photo ?')) return; var res=await window.enecSupabase.from('galerie').delete().eq('id',id); if(!res.error) adminLoadGalerie(); else alert(res.error.message); }

// VIDEOS
async function adminLoadVideos(){
  var list=document.getElementById('videos-list'); if(!list) return; list.innerHTML='<p>Chargement...</p>';
  var r=await window.enecSupabase.from('videos').select('*').order('ordre',{ascending:true});
  if(r.error){ list.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  list.innerHTML=(r.data||[]).map(function(v){ return '<div class="item" style="border:1px solid #ddd;padding:12px;margin-bottom:12px;border-radius:10px">'+(v.video_url?'<video src="'+adminEsc(v.video_url)+'" controls style="width:100%;border-radius:8px"></video>':(v.youtube_url?'<p>▶️ Vidéo YouTube : '+adminEsc(v.youtube_url)+'</p>':'<p>Pas de vidéo</p>'))+'<b>'+adminEsc(v.titre||'')+'</b><p>'+adminEsc(v.description||'')+'</p><button class="small" onclick="adminEditVideo(\''+v.id+'\')">✏️ Modifier</button> <button class="small" onclick="adminToggleVideo(\''+v.id+'\','+(v.actif===false?'true':'false')+')">'+(v.actif===false?'✅ Publier':'⏸️ Dépublier')+'</button> <button class="small danger" onclick="adminDeleteVideo(\''+v.id+'\')">🗑️ Supprimer</button></div>'; }).join('')||'<p>Aucune vidéo. Ajoute-en une ci-dessous.</p>';
  document.getElementById('videos-form').innerHTML='<h3>Ajouter / Modifier une vidéo</h3><input id="vi_id" type="hidden"><input id="vi_titre" placeholder="Titre de la vidéo"><textarea id="vi_desc" placeholder="Description"></textarea><label>Vidéo à téléverser (MP4)</label><input id="vi_file" type="file" accept="video/*"><label>OU lien YouTube</label><input id="vi_youtube" placeholder="https://youtube.com/..."><input id="vi_ordre" type="number" placeholder="Ordre"><button onclick="adminSaveVideo()">✅ Enregistrer cette vidéo</button><p id="vi_msg" class="msg"></p>';
}
async function adminSaveVideo(){ try{ var input=document.getElementById('vi_file'); var url=null; if(input && input.files && input.files[0]){ var f=input.files[0]; var name='video-'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.mp4'; var up=await window.enecSupabase.storage.from('enec-videos').upload(name,f,{upsert:true,contentType:'video/mp4'}); if(up.error) throw up.error; url=window.enecSupabase.storage.from('enec-videos').getPublicUrl(name).data.publicUrl; } var p={titre:document.getElementById('vi_titre').value,description:document.getElementById('vi_desc').value,youtube_url:document.getElementById('vi_youtube').value,ordre:parseInt(document.getElementById('vi_ordre').value||'99'),actif:true}; if(url) p.video_url=url; var id=document.getElementById('vi_id').value; var res=id?await window.enecSupabase.from('videos').update(p).eq('id',id).select():await window.enecSupabase.from('videos').insert([p]).select(); if(adminResult('vi_msg',res,'Vidéo enregistrée.')) adminLoadVideos(); }catch(e){ document.getElementById('vi_msg').textContent='❌ '+e.message; } }
async function adminEditVideo(id){ var r=await window.enecSupabase.from('videos').select('*').eq('id',id).single(); if(!r.error){ document.getElementById('vi_id').value=r.data.id; document.getElementById('vi_titre').value=r.data.titre||''; document.getElementById('vi_desc').value=r.data.description||''; document.getElementById('vi_youtube').value=r.data.youtube_url||''; document.getElementById('vi_ordre').value=r.data.ordre||''; } }
async function adminToggleVideo(id,v){ var res=await window.enecSupabase.from('videos').update({actif:v}).eq('id',id).select(); if(!res.error) adminLoadVideos(); else alert(res.error.message); }
async function adminDeleteVideo(id){ if(!confirm('Supprimer cette vidéo ?')) return; var res=await window.enecSupabase.from('videos').delete().eq('id',id); if(!res.error) adminLoadVideos(); else alert(res.error.message); }
