async function adminLoadProgramme(){
  var box=document.getElementById('programme-form');
  var r=await window.enecSupabase.from('programme').select('*').limit(1).maybeSingle();
  if(r.error){ box.innerHTML='<p class="msg">'+adminEsc(r.error.message)+'</p>'; return; }
  var d=r.data||{};
  box.innerHTML='<input id="pr_titre" value="'+adminEsc(d.titre||'Programme d\'Appui aux Entrepreneurs')+'"><textarea id="pr_desc">'+adminEsc(d.description||'')+'</textarea><button onclick="adminSaveProgramme()">Enregistrer</button><p id="pr_msg" class="msg"></p>';
}
async function adminSaveProgramme(){
  var p={titre:document.getElementById('pr_titre').value,description:document.getElementById('pr_desc').value,actif:true};
  var cur=await window.enecSupabase.from('programme').select('id').limit(1).maybeSingle();
  var res=cur.data?await window.enecSupabase.from('programme').update(p).eq('id',cur.data.id).select():await window.enecSupabase.from('programme').insert([p]).select();
  adminResult('pr_msg',res,'Programme enregistré.');
}
