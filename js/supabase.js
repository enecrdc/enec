// ENEC - Connexion Supabase (1 seul endroit pour tout le site)
function enecGetConfig(){
  var U = window.ENEC_SUPABASE_URL || "";
  var K = window.ENEC_SUPABASE_ANON_KEY || "";
  if(!U || U.indexOf('TON-PROJET')!==-1) U = "https://mlzacyrgnmentvilwvkm.supabase.co";
  if(!K || K.indexOf('TA-CLE')!==-1) K = null;
  return { url: U, key: K };
}
function enecGetClient(){
  var c = enecGetConfig();
  if(!c.key || !window.supabase) return null;
  return window.supabase.createClient(c.url, c.key);
}
function enecEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function enecLang(){ return (document.documentElement.lang||'fr').toLowerCase().indexOf('en')===0?'en':'fr'; }
function enecReplaceText(a,b){
  if(!a||!b||a===b) return;
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),ns=[],n;
  while(n=w.nextNode()){ if(n.nodeValue&&n.nodeValue.indexOf(a)!==-1) ns.push(n); }
  ns.forEach(function(t){ t.nodeValue=t.nodeValue.split(a).join(b); });
}
function enecReplaceAfterHeading(keys,txt){
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
function enecRenderList(keywords,items,build){
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
    var grid='<div data-enec-grid="1" class="grid">'+items.map(build).join('')+'</div>';
    var ex=cont.querySelector&&cont.querySelector('[data-enec-grid="1"]');
    if(ex){ ex.outerHTML=grid; return; }
    var old=null;
    [].forEach.call(cont.children,function(ch){ if(!old&&ch.querySelector&&ch.querySelector('img')) old=ch; });
    if(old){ old.outerHTML=grid; return; }
    cont.innerHTML=grid; return;
  }
}
function enecCard(img,title,sub,body){
  return '<article class="card">'
    +(img?'<img src="'+enecEsc(img)+'" style="width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:10px" loading="lazy" onerror="this.style.display=\'none\'">':'')
    +'<h3>'+enecEsc(title)+'</h3>'
    +(sub?'<p class="role">'+enecEsc(sub)+'</p>':'')
    +(body?'<p style="white-space:pre-line">'+enecEsc(body)+'</p>':'')
    +'</article>';
      }
