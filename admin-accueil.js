async function adminLoadAccueil(){
  var box = document.getElementById('accueil-form');
  var r = await window.enecSupabase.from('accueil').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML = '<p class="msg">Table accueil : '+adminEsc(r.error.message)+'</p>'; return; }
  var d = r.data || {};
  box.innerHTML = '<label>Titre</label><input id="acc_titre" value="'+adminEsc(d.titre||'Un nouvel espoir, de multiples opportunités !')+'">'
    + '<label>Slogan / Texte</label><textarea id="acc_texte">'+adminEsc(d.texte||'')+'</textarea>'
    + '<label>Image (optionnel, remplace)</label><input id="acc_image" type="file" accept="image/*">'
    + '<button onclick="adminSaveAccueil()">Enregistrer dans Supabase</button><p id="acc_msg" class="msg"></p>';
}
async function adminSaveAccueil(){
  try{
    var image = await adminUploadImage('acc_image');
    var payload = { titre: document.getElementById('acc_titre').value, texte: document.getElementById('acc_texte').value };
    if(image) payload.image = image;
    var cur = await window.enecSupabase.from('accueil').select('id').limit(1).maybeSingle();
    var res;
    if(cur.data) res = await window.enecSupabase.from('accueil').update(payload).eq('id', cur.data.id).select();
    else res = await window.enecSupabase.from('accueil').insert([payload]).select();
    if(adminResult('acc_msg', res, 'Accueil enregistré dans Supabase. Recharge le site public, il affichera le nouveau titre.')){}
  }catch(e){ document.getElementById('acc_msg').textContent = '❌ ' + e.message; }
}
