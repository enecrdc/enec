// ENEC - main.js - Lance tout, avec 3 essais (corrige le "pas toujours")
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
// 1er essai à 1s, 2e à 3s, 3e à 5s - si le 1er rate à cause du réseau, le 2e ou 3e réussit
setTimeout(enecLoadAll, 1000);
setTimeout(enecLoadAll, 3000);
setTimeout(enecLoadAll, 5000);
document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('button');
  if(b && (b.textContent.trim()==='FR' || b.textContent.trim()==='EN')) setTimeout(enecLoadAll, 800);
}, true);
document.addEventListener('visibilitychange', function(){ if(!document.hidden) enecLoadAll(); });
