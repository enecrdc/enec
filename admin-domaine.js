async function adminLoadDomaines(){
  var list = document.getElementById('domaines-list');
  var r = await window.enecSupabase.from('domaines').select('*').order('ordre',{ascending:true});
  if(r.error){ list.innerHTML = '<p class="msg">Table domaines : '+adminEsc(r.error.message)+'</p>'; return; }
  list.innerHTML = (r.data||[]).map(function(d){
    return '<div class="item"><b>'+adminEsc(d.icone||'')+' '+adminEsc(d.titre)+'</b> '+(d.actif===false?'<span>— DÉPUBLIÉ</span>':'<span>— Publié</span>')+'<p>'+adminEsc(d.description||'')+'</p>'
        + '<button class="small" onclick="adminToggleDomaine(\''+d.id+'\','+(d.actif===false?'true':'false')+')">'+(d.actif===false?'Publier':'Dépublier')+'</button> '
        + '<button class="small" onclick="adminEditDomaine(\''+d.id+'\')">Modifier</button> '
        + '<button class="small danger" onclick="adminDeleteDomaine(\''+d.id+'\')">Supprimer</button></div>';
  }).join('') || '<p>Aucun domaine. Ajoute Pisciculture ci-dessous.</p>';
  document.getElementById('domaines-form').innerHTML = '<h3>Ajouter / Modifier un domaine</h3><input id="dom_id" type="hidden"><input id="dom_titre" placeholder="Titre — ex : 🐟 Pisciculture"><textarea id="dom_desc" placeholder="Description"></textarea><input id="dom_icone" placeholder="Icône — ex : 🐟"><input id="dom_ordre" type="number" placeholder="Ordre — ex : 2"><button onclick="adminSaveDomaine()">Enregistrer</button><p id="dom_msg" class="msg"></p>';
}
async function adminSaveDomaine(){
  var id = document.getElementById('dom_id').value;
  var payload = { titre: document.getElementById('dom_titre').value, description: document.getElementById('dom_desc').value, icone: document.getElementById('dom_icone').value, ordre: parseInt(document.getElementById('dom_ordre').value||'99'), actif: true };
  if(!payload.titre){ alert('Titre obligatoire'); return; }
  var res = id ? await window.enecSupabase.from('domaines').update(payload).eq('id', id).select() : await window.enecSupabase.from('domaines').insert([payload]).select();
  if(adminResult('dom_msg', res, 'Domaine enregistré.')) adminLoadDomaines();
}
async function adminEditDomaine(id){
  var r = await window.enecSupabase.from('domaines').select('*').eq('id', id).single();
  if(r.error){ alert(r.error.message); return; }
  document.getElementById('dom_id').value = r.data.id;
  document.getElementById('dom_titre').value = r.data.titre||'';
  document.getElementById('dom_desc').value = r.data.description||'';
  document.getElementById('dom_icone').value = r.data.icone||'';
  document.getElementById('dom_ordre').value = r.data.ordre||'';
  window.scrollTo(0, document.getElementById('domaines-form').offsetTop);
}
async function adminToggleDomaine(id, val){
  var res = await window.enecSupabase.from('domaines').update({ actif: val }).eq('id', id).select();
  if(!res.error) adminLoadDomaines(); else alert(res.error.message);
}
async function adminDeleteDomaine(id){
  if(!confirm('Supprimer ce domaine définitivement ?')) return;
  var res = await window.enecSupabase.from('domaines').delete().eq('id', id);
  if(!res.error) adminLoadDomaines(); else alert(res.error.message);
}
