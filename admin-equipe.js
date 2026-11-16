async function adminLoadEquipe(){
  var list = document.getElementById('equipe-list');
  var r = await window.enecSupabase.from('equipe').select('*').order('ordre',{ascending:true});
  if(r.error){ list.innerHTML = '<p class="msg">Table equipe : '+adminEsc(r.error.message)+'</p>'; return; }
  list.innerHTML = (r.data||[]).map(function(m){
    return '<div class="item"><b>'+adminEsc(m.nom)+'</b> — '+adminEsc(m.role||'')+'<p>'+adminEsc(m.bio||'')+'</p>'+(m.photo?'<img class="thumb" src="'+adminEsc(m.photo)+'">':'')
        + '<br><button class="small" onclick="adminEditMembre(\''+m.id+'\')">Modifier</button> <button class="small danger" onclick="adminDeleteMembre(\''+m.id+'\')">Supprimer</button></div>';
  }).join('') || '<p>Aucun membre.</p>';
  document.getElementById('equipe-form').innerHTML = '<h3>Ajouter / Modifier un membre</h3><input id="eq_id" type="hidden"><input id="eq_nom" placeholder="Nom complet"><input id="eq_role" placeholder="Rôle"><textarea id="eq_bio" placeholder="Bio"></textarea><label>Photo (remplace si tu choisis un fichier)</label><input id="eq_photo" type="file" accept="image/*"><input id="eq_ordre" type="number" placeholder="Ordre"><button onclick="adminSaveMembre()">Enregistrer</button><p id="eq_msg" class="msg"></p>';
}
async function adminSaveMembre(){
  try{
    var photo = await adminUploadImage('eq_photo');
    var payload = { nom: document.getElementById('eq_nom').value, role: document.getElementById('eq_role').value, bio: document.getElementById('eq_bio').value, ordre: parseInt(document.getElementById('eq_ordre').value||'99'), actif: true };
    if(photo) payload.photo = photo;
    if(!payload.nom){ alert('Nom obligatoire'); return; }
    var id = document.getElementById('eq_id').value;
    var res = id ? await window.enecSupabase.from('equipe').update(payload).eq('id', id).select() : await window.enecSupabase.from('equipe').insert([payload]).select();
    if(adminResult('eq_msg', res, 'Membre enregistré.')) adminLoadEquipe();
  }catch(e){ document.getElementById('eq_msg').textContent = '❌ ' + e.message; }
}
async function adminEditMembre(id){
  var r = await window.enecSupabase.from('equipe').select('*').eq('id', id).single();
  if(r.error){ alert(r.error.message); return; }
  document.getElementById('eq_id').value = r.data.id; document.getElementById('eq_nom').value = r.data.nom||'';
  document.getElementById('eq_role').value = r.data.role||''; document.getElementById('eq_bio').value = r.data.bio||'';
  document.getElementById('eq_ordre').value = r.data.ordre||'';
}
async function adminDeleteMembre(id){
  if(!confirm('Supprimer ce membre ?')) return;
  var res = await window.enecSupabase.from('equipe').delete().eq('id', id);
  if(!res.error) adminLoadEquipe(); else alert(res.error.message);
}
