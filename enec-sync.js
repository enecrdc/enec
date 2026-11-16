// ENEC SYNC V3 - Le seul code qui lit Supabase sur le site public
// Source de vérité : les MÊMES tables que admin.html
// enec_settings, enec_team, enec_domains, enec_achievements, enec_programme, enec_news
// Filtres : actif=true sauf news où publie=true. Images : photo_url / image_url (Storage enec-images)
(function(){
  var LAST={};
  function getCfg(){
    var U=window.ENEC_SUPABASE_URL||"https://mlzacyrgnmentvilwvkm.supabase.co";
    var K=window.ENEC_SUPABASE_ANON_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1semFjeXJnbm1lbnR2aWx3dmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MDA2NzMsImV4cCI6MjExMDE3NjY3M30.RO1EmPo3hpm9ceb5U0-ZeeG1Uv1XePnOzZ7tmPix26w";
    if(!U||U.indexOf('https://mlzacyrgnmentvilwvkm.supabase.co')!==-1) U="https://mlzacyrgnmentvilwvkm.supabase.co";
    if(!K||K.indexOf('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1semFjeXJnbm1lbnR2aWx3dmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2MDA2NzMsImV4cCI6MjExMDE3NjY3M30.RO1EmPo3hpm9ceb5U0-ZeeG1Uv1XePnOzZ7tmPix26w')!==-1) K=null;
    return {U:U,K:K};
  }
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function lang(){ return (document.documentElement.lang||'fr').toLowerCase().indexOf('en')===0?'en':'fr'; }
  function replaceText(a,b){
    if(!a||!b||a===b) return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),ns=[],n;
    while(n=w.nextNode()){ if(n.nodeValue&&n.nodeValue.indexOf(a)!==-1) ns.push(n); }
    ns.forEach(function(t){ t.nodeValue=t.nodeValue.split(a).join(b); });
  }
  function replaceAfterHeading(keys,txt){
    if(!txt) return;
    var hs=[].slice.call(document.querySelectorAll('h1,h2,h3,h4'));
    for(var i=0;i<hs.length;i++){
      var t=hs[i].textContent.toLowerCase();
      if(!keys.some(function(k){return t.indexOf(k)!==-1;})) continue;
      var p=hs[i].nextElementSibling,c=0;
      while(p&&c<6){
        if(p.tagName==='P'&&p.textContent.trim().length>15){p.textContent=txt;return;}
        var q=p.querySelector?p.querySelector('p'):null;
        if(q&&q.textContent.trim().length>15){q.textContent=txt;return;}
        p=p.nextElementSibling;c++;
      }
    }
  }
  function applySettings(s){
    if(!s) return; LAST.settings=s;
    var L=lang();
    var slogan=L==='fr'?(s.slogan_fr||s.slogan_en):(s.slogan_en||s.slogan_fr);
    var titre=L==='fr'?(s.accueil_titre_fr||s.titre_accueil_fr):(s.accueil_titre_en||s.titre_accueil_en);
    var texte=L==='fr'?s.accueil_texte_fr:s.accueil_texte_en;
    if(slogan){
      replaceText("Un nouvel espoir, de multiples opportunités !",slogan);
      replaceText("de multiples opportunités !",slogan);
      replaceText("A new hope, of multiple opportunities!",slogan);
    }
    if(titre){ replaceText("Un nouvel espoir,",titre); replaceText("A new hope,",titre); }
    if(texte){
      var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),ns=[],nn;
      while(nn=w.nextNode()){ if(nn.nodeValue&&nn.nodeValue.indexOf('Bienvenue chez ENEC')!==-1) ns.push(nn); }
      ns.forEach(function(t){t.nodeValue=texte;});
      replaceAfterHeading(["bienvenue","welcome"],texte);
    }
    var ap=L==='fr'?s.apropos_fr:s.apropos_en;
    if(ap) replaceAfterHeading(["à propos","about","présentation"],ap);
    var mi=L==='fr'?s.mission_fr:s.mission_en; if(mi) replaceAfterHeading(["mission"],mi);
    var vi=L==='fr'?s.vision_fr:s.vision_en; if(vi) replaceAfterHeading(["vision"],vi);
    var va=L==='fr'?s.valeurs_fr:s.valeurs_en;
    if(va){
      var hs=[].slice.call(document.querySelectorAll('h1,h2,h3'));
      for(var i=0;i<hs.length;i++){
        var ht=hs[i].textContent.toLowerCase();
        if(ht.indexOf('valeur')!==-1||ht.indexOf('value')!==-1){
          var sib=hs[i].nextElementSibling;
          if(sib&&(sib.tagName==='UL'||sib.tagName==='DIV'||sib.tagName==='OL')){
            sib.innerHTML=va.split('\n').filter(function(x){return x.trim();}).map(function(v){return '<li style="margin:6px 0">✅ '+esc(v.trim())+'</li>';}).join('');
          }
        }
      }
    }
    var tel1=s.contact_tel1||s.telephone1, tel2=s.contact_tel2||s.telephone2;
    var email=s.contact_email||s.email, adr=s.contact_adresse||s.adresse;
    if(tel1) replaceText("+243 970 204 871",tel1);
    if(tel2) replaceText("+243 962 471 683",tel2);
    if(email){ replaceText("enecbusiness20@gmail.com",email); replaceText("furahahabamungu2005@gmail.com",email); }
    if(adr) replaceText("Avenue de la Bière, commune d’Ibanda, ville de Bukavu, province du Sud-Kivu, République démocratique du Congo",adr);
    if(s.footer_copyright){
      var cw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),cn=[],cnn;
      while(cnn=cw.nextNode()){ if(cnn.nodeValue&&cnn.nodeValue.indexOf('©')!==-1&&cnn.nodeValue.indexOf('ENEC')!==-1) cn.push(cnn); }
      cn.forEach(function(t){t.nodeValue=s.footer_copyright;});
    }
    var wa=(s.contact_whatsapp||s.whatsapp||'').replace(/[^0-9]/g,'');
    if(wa) [].forEach.call(document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]'),function(a){a.setAttribute('href','https://wa.me/'+wa+'?text='+encodeURIComponent('Bonjour ENEC'));});
    if(s.contact_facebook) [].forEach.call(document.querySelectorAll('a[href*="facebook.com"]'),function(a){a.setAttribute('href',s.contact_facebook);});
    if(s.contact_instagram) [].forEach.call(document.querySelectorAll('a[href*="instagram.com"]'),function(a){a.setAttribute('href',s.contact_instagram);});
    if(s.contact_linkedin) [].forEach.call(document.querySelectorAll('a[href*="linkedin.com"]'),function(a){a.setAttribute('href',s.contact_linkedin);});
    // IMAGES - CORRIGÉ : bannière + photo À propos = URL Supabase
    if(s.accueil_banniere_url&&(s.accueil_banniere_url.indexOf('supabase')!==-1||s.accueil_banniere_url.indexOf('enec-images')!==-1)){
      var imgs=[].slice.call(document.querySelectorAll('img')); if(imgs.length) imgs[0].src=s.accueil_banniere_url;
    }
    if(s.apropos_image_url){
      var hs2=[].slice.call(document.querySelectorAll('h1,h2,h3'));
      for(var k=0;k<hs2.length;k++){
        if(hs2[k].textContent.toLowerCase().indexOf('propos')!==-1){
          var sec=hs2[k].parentElement; if(sec){var im=sec.querySelector('img'); if(im) im.src=s.apropos_image_url;} break;
        }
      }
    }
  }
  // Remplace TOUTE la grille d'une section, pas juste du texte. C'est ce qui fait apparaître les NOUVEAUX membres.
  function renderList(keywords,items,build){
    if(!items||!items.length) return;
    var hs=[].slice.call(document.querySelectorAll('h1,h2,h3'));
    for(var i=0;i<hs.length;i++){
      var txt=hs[i].textContent.toLowerCase();
      if(!keywords.some(function(k){return txt.indexOf(k)!==-1;})) continue;
      var sib=hs[i].nextElementSibling,tries=0,cont=null;
      while(sib&&tries<5){
        if(sib.querySelectorAll&&sib.querySelectorAll('img').length>=1){cont=sib;break;}
        if(sib.children&&sib.children.length>=2){cont=sib;break;}
        sib=sib.nextElementSibling;tries++;
      }
      if(!cont) cont=hs[i].parentElement;
      if(!cont) return;
      var grid='<div data-enec-grid="1" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:12px">'+items.map(build).join('')+'</div>';
      var ex=cont.querySelector&&cont.querySelector('[data-enec-grid="1"]');
      if(ex){ ex.outerHTML=grid; return; }
      // Si cont est la section, remplacer l'ancienne grille (qui contient les anciens membres)
      var old=null;
      [].forEach.call(cont.children,function(ch){ if(!old&&ch.querySelector&&ch.querySelector('img')) old=ch; });
      if(old){ old.outerHTML=grid; return; }
      cont.innerHTML=grid; return;
    }
  }
  function card(img,title,sub,body){
    return '<article style="border:1px solid #E2E8F0;border-radius:16px;padding:14px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.04)">'
      +(img?'<img src="'+esc(img)+'" style="width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:10px" loading="lazy" onerror="this.style.display=\'none\'">':'')
      +'<h3 style="margin:0 0 6px;font-size:17px;color:#0A2540">'+esc(title)+'</h3>'
      +(sub?'<p style="margin:0 0 6px;color:#0F9D6A;font-weight:700;font-size:13px">'+esc(sub)+'</p>':'')
      +(body?'<p style="margin:0;color:#334155;font-size:14px;line-height:1.6;white-space:pre-line">'+esc(body)+'</p>':'')
      +'</article>';
  }
  async function load(){
    try{
      var cfg=getCfg();
      if(!cfg.K||!window.supabase){ if(location.search.indexOf('debug=1')!==-1) console.log('[ENEC] clé anon manquante dans admin-config.js'); return; }
      var sb=window.supabase.createClient(cfg.U,cfg.K);
      // CORRIGÉ : la ligne la PLUS RÉCENTE, pas la 1ère
      var s=await sb.from('enec_settings').select('*').order('updated_at',{ascending:false}).limit(1).maybeSingle();
      if(!s.error&&s.data) applySettings(s.data);
      var t=await sb.from('enec_team').select('*').order('ordre',{ascending:true});
      if(!t.error&&t.data){
        var team=t.data.filter(function(m){return m.actif!==false;});
        renderList(["équipe","equipe","notre équipe","our team","team"],team,function(m){
          var ini=esc((m.nom||'?').slice(0,2).toUpperCase());
          var av=m.photo_url?'<img src="'+esc(m.photo_url)+'" style="width:84px;height:84px;border-radius:50%;object-fit:cover;margin:0 auto 8px;display:block" onerror="this.style.display=\'none\'">':'<div style="width:84px;height:84px;border-radius:50%;background:#0A2540;color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;margin:0 auto 8px">'+ini+'</div>';
          return '<article style="border:1px solid #E2E8F0;border-radius:16px;padding:14px;background:#fff;text-align:center">'+av+'<h3 style="margin:0;color:#0A2540">'+esc(m.nom)+'</h3><p style="color:#0F9D6A;font-weight:700;margin:4px 0">'+esc(m.fonction_fr||'')+'</p><p style="color:#334155;font-size:14px;white-space:pre-line">'+esc(m.bio_fr||'')+'</p></article>';
        });
      }
      var d=await sb.from('enec_domains').select('*').order('ordre',{ascending:true});
      if(!d.error&&d.data) renderList(["domaine","domaines","intervention"],d.data.filter(function(x){return x.actif!==false;}),function(x){
        var b=(x.description_fr||'')+(x.services_fr?'\n\nServices :\n'+x.services_fr:'');
        return card(x.image_url,x.titre_fr,x.responsable?('Responsable : '+x.responsable):'',b);
      });
      var r=await sb.from('enec_achievements').select('*').order('ordre',{ascending:true});
      if(!r.error&&r.data) renderList(["réalisation","realisation","réalisations","achievements"],r.data.filter(function(x){return x.actif!==false;}),function(x){ return card(x.image_url,x.titre_fr,x.annee||'',x.description_fr||''); });
      var p=await sb.from('enec_programme').select('*').order('ordre',{ascending:true});
      if(!p.error&&p.data) renderList(["programme","program","appui aux entrepreneurs","entrepreneur"],p.data.filter(function(x){return x.actif!==false;}),function(x){
        var b=(x.intro_fr||'')+(x.objectifs_fr?'\n\nObjectifs :\n'+x.objectifs_fr:'')+(x.activites_fr?'\n\nActivités :\n'+x.activites_fr:'');
        return card(x.image_url,x.titre_fr,'',b);
      });
      var n=await sb.from('enec_news').select('*').order('date_pub',{ascending:false});
      if(!n.error&&n.data){
        var news=n.data.filter(function(x){return x.publie===true;});
        if(news.length) renderList(["actualité","actualités","news"],news,function(x){ return card(x.image_url,x.titre_fr,(x.categorie||'')+' • '+(x.date_pub||''),x.resume_fr||x.contenu_fr||''); });
      }
      if(location.search.indexOf('debug=1')!==-1) console.log('[ENEC SYNC V3] OK - données Supabase appliquées');
      window.ENEC_LAST_SYNC={at:new Date().toISOString(),settings:LAST.settings};
    }catch(e){ console.log('[ENEC SYNC V3]',e); }
  }
  setTimeout(load,1000); setTimeout(load,3000);
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('button');
    if(b&&(b.textContent.trim()==='FR'||b.textContent.trim()==='EN')) setTimeout(load,600);
  },true);
  document.addEventListener('visibilitychange',function(){ if(!document.hidden) load(); });
})();
