async function adminLoadActualites(){
  var r = await window.enecSupabase.from('actualites').select('*').order('created_at',{ascending:false});
  var list = document.getElementById('actualites-list');
  if(r.error){ list.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  list.innerHTML=(r.data||[]).map(function(x){ return '<div class="item"><b>'+adminEsc(x.titre)+'</b> '+(x.publie?'— Publié':'— Brouillon')+'<p>'+adminEsc(x.contenu||'')+'</p>'+(x.image?'<img class="thumb" src="'+adminEsc(x.image)+'">':'')+'<br><button class="small" onclick="adminToggleActu(\''+x.id+'\','+(x.publie?'false':'true')+')">'+(x.publie?'Dépublier':'Publier')+'</button> <button class="small danger" onclick="adminDeleteActu(\''+x.id+'\')">Supprimer</button></div>'; }).join('')||'<p>Aucune actualité.</p>';
  document.getElementById('actualites-form').innerHTML='<h3>Publier un article</h3><input id="ac_titre" placeholder="Titre"><textarea id="ac_contenu" placeholder="Contenu"></textarea><input id="ac_image" type="file" accept="image/*"><button onclick="adminSaveActu()">Publier</button><p id="ac_msg" class="msg"></p>';
}
async function adminSaveActu(){ try{ var img=await adminUploadImage('ac_image'); var p={titre:document.getElementById('ac_titre').value,contenu:document.getElementById('ac_contenu').value,publie:true}; if(img) p.image=img; var res=await window.enecSupabase.from('actualites').insert([p]).select(); if(adminResult('ac_msg',res,'Article publié.')) adminLoadActualites(); }catch(e){ document.getElementById('ac_msg').textContent='❌ '+e.message; } }
async function adminToggleActu(id,v){ var res=await window.enecSupabase.from('actualites').update({publie:v}).eq('id',id).select(); if(!res.error) adminLoadActualites(); else alert(res.error.message); }
async function adminDeleteActu(id){ if(!confirm('Supprimer ?')) return; var res=await window.enecSupabase.from('actualites').delete().eq('id',id); if(!res.error) adminLoadActualites(); else alert(res.error.message); }
