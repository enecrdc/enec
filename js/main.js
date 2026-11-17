// ENEC Public - lit Supabase, mêmes données que l'admin
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function getImages(g){
  if(g.images){ try{ var arr=JSON.parse(g.images); if(Array.isArray(arr) && arr.length) return arr; }catch(e){} }
  if(g.image) return [g.image];
  return [];
}

async function loadPublic(){
  if(!window.enecSupabase) return;

  // --- EQUIPE ---
  try{
    var r=await window.enecSupabase.from('equipe').select('*').eq('actif',true).order('ordre',{ascending:true});
    var box=document.getElementById('equipe-list');
    if(box){
      if(r.error) box.innerHTML='<p>Équipe bientôt disponible.</p>';
      else if(!r.data || !r.data.length) box.innerHTML='<p>Équipe bientôt disponible.</p>';
      else box.innerHTML=r.data.map(function(m,idx){
        return '<article class="team-card">'
        +'<div class="team-photo">'+(m.photo?'<img src="'+esc(m.photo)+'" alt="'+esc(m.nom)+'" loading="lazy">':'<div class="team-no-photo">👤</div>')+'</div>'
        +'<div class="team-body"><h3>'+esc(m.nom)+'</h3><p class="team-role">'+esc(m.role||'')+'</p><p class="team-bio">'+esc((m.bio||'').slice(0,120))+(m.bio && m.bio.length>120?'...':'')+'</p>'
        +'<button class="btn-small" onclick="openProfil('+idx+')">Voir le profil →</button></div></article>';
      }).join('');
      window.ENEC_TEAM = r.data||[];
    }
  }catch(e){}

  // --- DOMAINES ---
  try{
    var d=await window.enecSupabase.from('domaines').select('*').eq('actif',true).order('ordre',{ascending:true});
    var db=document.getElementById('domaines-list');
    if(db){
      if(d.error || !d.data || !d.data.length) db.innerHTML='<p>Domaines bientôt disponibles.</p>';
      else db.innerHTML=d.data.map(function(x){
        return '<article class="domain-card">'
        +'<div class="domain-img">'+(x.image?'<img src="'+esc(x.image)+'" alt="'+esc(x.titre)+'" loading="lazy">':'<div class="domain-no-img">'+esc(x.icone||'✦')+'</div>')+'</div>'
        +'<div class="domain-body"><h3>'+esc(x.titre)+'</h3><p>'+esc(x.description||'')+'</p>'
        +(x.services?'<p class="domain-services"><b>Services :</b> '+esc(x.services)+'</p>':'')
        +'<button class="btn-small" onclick="alert(\''+esc((x.services||x.description||'').replace(/'/g,"\\'"))+'\')">Découvrir les services →</button></div></article>';
      }).join('');
    }
  }catch(e){}

  // --- GALERIE ---
  try{
    var g=await window.enecSupabase.from('galerie').select('*').eq('actif',true).order('date_activite',{ascending:false});
    var gb=document.getElementById('galerie-list');
    if(gb){
      if(g.error || !g.data || !g.data.length) gb.innerHTML='<p>Galerie bientôt disponible. Les activités à venir seront publiées ici.</p>';
      else{
        window.ENEC_GALERIE = g.data;
        gb.innerHTML=g.data.map(function(pub,idx){
          var imgs=getImages(pub);
          return '<article class="gallery-card" onclick="openGallery('+idx+',0)">'
          +'<div class="gallery-img">'+(imgs[0]?'<img src="'+esc(imgs[0])+'" alt="'+esc(pub.titre)+'" loading="lazy">':'<div class="gallery-no-img">🖼️</div>')+(imgs.length>1?'<span class="gallery-count">+'+(imgs.length-1)+' photos</span>':'')+'</div>'
          +'<div class="gallery-body"><span class="gallery-cat">'+esc(pub.categorie||'Activité')+'</span><h3>'+esc(pub.titre||'')+'</h3><p>'+esc((pub.description||'').slice(0,110))+'</p><small>'+(pub.date_activite?esc(pub.date_activite)+' • ':'')+esc(pub.lieu||'')+'</small></div></article>';
        }).join('');
      }
    }
  }catch(e){}

  // --- REALISATIONS / ACTUALITES / VIDEOS ---
  try{
    var re=await window.enecSupabase.from('realisations').select('*').eq('actif',true).order('ordre',{ascending:true});
    var rb=document.getElementById('realisations-list');
    if(rb && re.data) rb.innerHTML=re.data.map(function(x){ return '<div class="item"><b>'+esc(x.titre)+'</b><p>'+esc(x.description||'')+'</p>'+(x.image?'<img src="'+esc(x.image)+'" style="width:100%;height:180px;object-fit:cover;border-radius:10px">':'')+'</div>'; }).join('')||'<p>Bientôt disponible.</p>';
  }catch(e){}
  try{
    var ac=await window.enecSupabase.from('actualites').select('*').eq('publie',true).order('created_at',{ascending:false});
    var ab=document.getElementById('actualites-list');
    if(ab && ac.data) ab.innerHTML=ac.data.map(function(x){ return '<div class="item"><b>'+esc(x.titre)+'</b><p>'+esc(x.contenu||'')+'</p>'+(x.image?'<img src="'+esc(x.image)+'" style="width:100%;height:180px;object-fit:cover;border-radius:10px">':'')+'</div>'; }).join('')||'<p>Bientôt disponible.</p>';
  }catch(e){}
  try{
    var vi=await window.enecSupabase.from('videos').select('*').eq('actif',true).order('ordre',{ascending:true});
    var vb=document.getElementById('videos-list');
    if(vb && vi.data) vb.innerHTML=vi.data.map(function(v){ return '<div class="item">'+(v.video_url?'<video src="'+esc(v.video_url)+'" controls style="width:100%;border-radius:10px"></video>':(v.youtube_url?'<a href="'+esc(v.youtube_url)+'" target="_blank">▶️ Voir sur YouTube</a>':''))+'<b>'+esc(v.titre||'')+'</b><p>'+esc(v.description||'')+'</p></div>'; }).join('')||'<p>Bientôt disponible.</p>';
  }catch(e){}
}

// --- MODAL PROFIL MEMBRE ---
function openProfil(idx){
  var m=(window.ENEC_TEAM||[])[idx]; if(!m) return;
  document.getElementById('modal-title').textContent=m.nom||'';
  document.getElementById('modal-body').innerHTML=(m.photo?'<img src="'+esc(m.photo)+'" style="width:100%;max-height:300px;object-fit:cover;border-radius:12px;margin-bottom:12px">':'')+'<p><b>'+esc(m.role||'')+'</b></p><p style="white-space:pre-wrap;line-height:1.7">'+esc(m.bio||'Biographie bientôt disponible.')+'</p>';
  document.getElementById('modal').style.display='flex';
}
function closeModal(){ document.getElementById('modal').style.display='none'; }

// --- LIGHTBOX GALERIE ---
var galIdx=0, galImgIdx=0;
function openGallery(idx,imgIdx){
  var pub=(window.ENEC_GALERIE||[])[idx]; if(!pub) return;
  galIdx=idx; galImgIdx=imgIdx||0;
  showGalleryImg();
  document.getElementById('gallery-modal').style.display='flex';
}
function showGalleryImg(){
  var pub=(window.ENEC_GALERIE||[])[galIdx]; if(!pub) return;
  var imgs=getImages(pub);
  var img=imgs[galImgIdx]||'';
  document.getElementById('gallery-modal-img').src=img;
  document.getElementById('gallery-modal-title').textContent=(pub.titre||'')+' — '+(galImgIdx+1)+'/'+imgs.length;
  document.getElementById('gallery-modal-desc').textContent=(pub.description||'')+' '+(pub.lieu?' • '+pub.lieu:'')+' '+(pub.date_activite?' • '+pub.date_activite:'');
}
function galleryNext(){ var imgs=getImages((window.ENEC_GALERIE||[])[galIdx]); galImgIdx=(galImgIdx+1)%imgs.length; showGalleryImg(); }
function galleryPrev(){ var imgs=getImages((window.ENEC_GALERIE||[])[galIdx]); galImgIdx=(galImgIdx-1+imgs.length)%imgs.length; showGalleryImg(); }
function closeGallery(){ document.getElementById('gallery-modal').style.display='none'; }

// --- FORMULAIRE CONTACT ---
window.addEventListener('DOMContentLoaded', function(){
  loadPublic();
  var f=document.getElementById('contact-form');
  if(f) f.addEventListener('submit', async function(e){
    e.preventDefault();
    var fd=new FormData(f);
    var res=await window.enecSupabase.from('messages').insert([{nom:fd.get('nom'),email:fd.get('email'),message:fd.get('message')}]).select();
    document.getElementById('contact-msg').textContent=res.error?'❌ '+res.error.message:'✅ Message envoyé. Nous vous répondrons bientôt.';
    if(!res.error) f.reset();
  });
});
