// ENEC - Réalisations + Programme - Tables enec_achievements et enec_programme
async function enecLoadRealisations(sb){
  var r = await sb.from('enec_achievements').select('*').order('ordre',{ascending:true});
  if(!r.error && r.data){
    var reals = r.data.filter(function(x){ return x.actif!==false; });
    enecRenderList(["réalisation","realisation","réalisations","achievements"], reals, function(x){
      return enecCard(x.image_url, x.titre_fr, x.annee||'', x.description_fr||'');
    });
  }
  var p = await sb.from('enec_programme').select('*').order('ordre',{ascending:true});
  if(!p.error && p.data){
    var progs = p.data.filter(function(x){ return x.actif!==false; });
    enecRenderList(["programme","program","appui aux entrepreneurs","entrepreneur"], progs, function(x){
      var b = (x.intro_fr||'') + (x.objectifs_fr ? '\n\nObjectifs :\n'+x.objectifs_fr : '') + (x.activites_fr ? '\n\nActivités :\n'+x.activites_fr : '');
      return enecCard(x.image_url, x.titre_fr, '', b);
    });
  }
                      }
