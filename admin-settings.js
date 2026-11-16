async function adminLoadSettings(){
  var box=document.getElementById('settings-form');
  var r=await window.enecSupabase.from('settings').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  var d=r.data||{};
  box.innerHTML='<input id="st_nom" value="'+adminEsc(d.nom_site||'ENEC')+'"><input id="st_slogan" value="'+adminEsc(d.slogan||'Un nouvel espoir, de multiples opportunités !')+'"><input id="st_whatsapp" value="'+adminEsc(d.whatsapp||'+243970204871')+'"><button onclick="adminSaveSettings()">Enregistrer</button><p id="st_msg" class="msg"></p>';
}
async function adminSaveSettings(){
  var p={nom_site:document.getElementById('st_nom').value,slogan:document.getElementById('st_slogan').value,whatsapp:document.getElementById('st_whatsapp').value};
  var cur=await window.enecSupabase.from('settings').select('id').limit(1).maybeSingle();
  var res=cur.data?await window.enecSupabase.from('settings').update(p).eq('id',cur.data.id).select():await window.enecSupabase.from('settings').insert([p]).select();
  adminResult('st_msg',res,'Paramètres enregistrés.');
}
