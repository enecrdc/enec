async function adminLoadContact(){
  var box=document.getElementById('contact-form');
  var r=await window.enecSupabase.from('contact').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  var d=r.data||{};
  box.innerHTML='<input id="ct_adresse" value="'+adminEsc(d.adresse||'Avenue de la Bière, Ibanda, Bukavu')+'"><input id="ct_tel" value="'+adminEsc(d.telephone||'+243 970 204 871')+'"><input id="ct_email" value="'+adminEsc(d.email||'enecbusiness20@gmail.com')+'"><input id="ct_horaires" value="'+adminEsc(d.horaires||'Lun - Ven : 08h00 - 17h00')+'"><button onclick="adminSaveContact()">Enregistrer</button><p id="ct_msg" class="msg"></p>';
  var m=await window.enecSupabase.from('messages').select('*').order('created_at',{ascending:false}).limit(20);
  document.getElementById('messages-list').innerHTML='<h3>Messages reçus</h3>'+((m.data||[]).map(function(x){ return '<div class="item"><b>'+adminEsc(x.nom||'')+'</b> — '+adminEsc(x.email||'')+'<p>'+adminEsc(x.message||'')+'</p></div>'; }).join('')||'<p>Aucun message.</p>');
}
async function adminSaveContact(){
  var p={adresse:document.getElementById('ct_adresse').value,telephone:document.getElementById('ct_tel').value,email:document.getElementById('ct_email').value,horaires:document.getElementById('ct_horaires').value};
  var cur=await window.enecSupabase.from('contact').select('id').limit(1).maybeSingle();
  var res=cur.data?await window.enecSupabase.from('contact').update(p).eq('id',cur.data.id).select():await window.enecSupabase.from('contact').insert([p]).select();
  adminResult('ct_msg',res,'Contact enregistré.');
}
