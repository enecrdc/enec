// ENEC - Équipe - Table enec_team - Filtre actif=true
async function enecLoadEquipe(sb){
  var t = await sb.from('enec_team').select('*').order('ordre',{ascending:true});
  if(t.error || !t.data) { console.log('[ENEC equipe]', t.error); return; }
  var team = t.data.filter(function(m){ return m.actif!==false; });
  enecRenderList(["équipe","equipe","notre équipe","our team","team"], team, function(m){
    var ini = enecEsc((m.nom||'?').slice(0,2).toUpperCase());
    var av = m.photo_url
      ? '<img src="'+enecEsc(m.photo_url)+'" style="width:84px;height:84px;border-radius:50%;object-fit:cover;margin:0 auto 8px;display:block" onerror="this.style.display=\'none\'">'
      : '<div style="width:84px;height:84px;border-radius:50%;background:#0A2540;color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;margin:0 auto 8px">'+ini+'</div>';
    return '<article class="card" style="text-align:center">'+av
      +'<h3>'+enecEsc(m.nom)+'</h3>'
      +'<p class="role">'+enecEsc(m.fonction_fr||'')+'</p>'
      +'<p style="white-space:pre-line">'+enecEsc(m.bio_fr||'')+'</p></article>';
  });
}
