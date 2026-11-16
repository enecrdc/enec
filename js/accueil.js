// ENEC - Accueil / À propos / Mission / Vision / Valeurs - Table enec_settings
async function enecLoadAccueil(sb){
  var s = await sb.from('enec_settings').select('*').order('updated_at',{ascending:false}).limit(1).maybeSingle();
  if(s.error || !s.data) { console.log('[ENEC accueil]', s.error); return; }
  var d = s.data, L = enecLang();
  var slogan = L==='fr' ? (d.slogan_fr||d.slogan_en) : (d.slogan_en||d.slogan_fr);
  var titre = L==='fr' ? (d.accueil_titre_fr||d.titre_accueil_fr) : (d.accueil_titre_en||d.titre_accueil_en);
  var texte = L==='fr' ? d.accueil_texte_fr : d.accueil_texte_en;
  if(slogan){
    enecReplaceText("Un nouvel espoir, de multiples opportunités !", slogan);
    enecReplaceText("de multiples opportunités !", slogan);
    enecReplaceText("A new hope, of multiple opportunities!", slogan);
  }
  if(titre){ enecReplaceText("Un nouvel espoir,", titre); enecReplaceText("A new hope,", titre); }
  if(texte){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),ns=[],nn;
    while(nn=w.nextNode()){ if(nn.nodeValue&&nn.nodeValue.indexOf('Bienvenue chez ENEC')!==-1) ns.push(nn); }
    ns.forEach(function(t){ t.nodeValue=texte; });
    enecReplaceAfterHeading(["bienvenue","welcome"], texte);
  }
  var ap = L==='fr'?d.apropos_fr:d.apropos_en; if(ap) enecReplaceAfterHeading(["à propos","about","présentation"], ap);
  var mi = L==='fr'?d.mission_fr:d.mission_en; if(mi) enecReplaceAfterHeading(["mission"], mi);
  var vi = L==='fr'?d.vision_fr:d.vision_en; if(vi) enecReplaceAfterHeading(["vision"], vi);
  var va = L==='fr'?d.valeurs_fr:d.valeurs_en;
  if(va){
    var hs=[].slice.call(document.querySelectorAll('h1,h2,h3'));
    for(var i=0;i<hs.length;i++){
      var ht=hs[i].textContent.toLowerCase();
      if(ht.indexOf('valeur')!==-1||ht.indexOf('value')!==-1){
        var sib=hs[i].nextElementSibling;
        if(sib&&(sib.tagName==='UL'||sib.tagName==='DIV'||sib.tagName==='OL')){
          sib.innerHTML=va.split('\n').filter(function(x){return x.trim();}).map(function(v){return '<li style="margin:6px 0">✅ '+enecEsc(v.trim())+'</li>';}).join('');
        }
      }
    }
  }
  if(d.footer_copyright){
    var cw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),cn=[],cnn;
    while(cnn=cw.nextNode()){ if(cnn.nodeValue&&cnn.nodeValue.indexOf('©')!==-1&&cnn.nodeValue.indexOf('ENEC')!==-1) cn.push(cnn); }
    cn.forEach(function(t){ t.nodeValue=d.footer_copyright; });
  }
  if(d.accueil_banniere_url && (d.accueil_banniere_url.indexOf('supabase')!==-1 || d.accueil_banniere_url.indexOf('enec-images')!==-1)){
    var imgs=[].slice.call(document.querySelectorAll('img')); if(imgs.length) imgs[0].src=d.accueil_banniere_url;
  }
  if(d.apropos_image_url){
    var hs2=[].slice.call(document.querySelectorAll('h1,h2,h3'));
    for(var k=0;k<hs2.length;k++){
      if(hs2[k].textContent.toLowerCase().indexOf('propos')!==-1){
        var sec=hs2[k].parentElement; if(sec){ var im=sec.querySelector('img'); if(im) im.src=d.apropos_image_url; } break;
      }
    }
  }
}
