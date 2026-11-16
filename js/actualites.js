// ENEC - Actualités - Table enec_news - Filtre publie=true seulement
async function enecLoadActualites(sb){
  var n = await sb.from('enec_news').select('*').order('date_pub',{ascending:false});
  if(n.error || !n.data) { console.log('[ENEC news]', n.error); return; }
  var news = n.data.filter(function(x){ return x.publie===true; });
  if(!news.length) return;
  enecRenderList(["actualité","actualités","news"], news, function(x){
    return enecCard(x.image_url, x.titre_fr, (x.categorie||'')+' • '+(x.date_pub||''), x.resume_fr||x.contenu_fr||'');
  });
}
