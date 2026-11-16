// ENEC - Domaines - Table enec_domains - Filtre actif=true
async function enecLoadDomaines(sb){
  var d = await sb.from('enec_domains').select('*').order('ordre',{ascending:true});
  if(d.error || !d.data) { console.log('[ENEC domaines]', d.error); return; }
  var doms = d.data.filter(function(x){ return x.actif!==false; });
  enecRenderList(["domaine","domaines","intervention"], doms, function(x){
    var b = (x.description_fr||'') + (x.services_fr ? '\n\nServices :\n'+x.services_fr : '');
    return enecCard(x.image_url, x.titre_fr, x.responsable ? ('Responsable : '+x.responsable) : '', b);
  });
}
