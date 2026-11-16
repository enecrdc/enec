// ENEC - main.js - Lance tout
async function enecLoadAll(){
  var sb = enecGetClient();
  if(!sb){ if(location.search.indexOf('debug=1')!==-1) console.log('[ENEC] clé anon manquante dans admin-config.js'); return; }
  try{
    await enecLoadAccueil(sb);
    await enecLoadEquipe(sb);
    await enecLoadDomaines(sb);
    await enecLoadRealisations(sb);
    await enecLoadActualites(sb);
    await enecLoadContact(sb);
    if(location.search.indexOf('debug=1')!==-1) console.log('[ENEC SYNC] OK - données Supabase appliquées');
  }catch(e){ console.log('[ENEC SYNC]', e); }
}
setTimeout(enecLoadAll, 1000);
setTimeout(enecLoadAll, 3000);
document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('button');
  if(b && (b.textContent.trim()==='FR' || b.textContent.trim()==='EN')) setTimeout(enecLoadAll, 600);
}, true);
document.addEventListener('visibilitychange', function(){ if(!document.hidden) enecLoadAll(); });
