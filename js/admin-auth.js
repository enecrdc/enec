async function adminLogin(){
  var msg=document.getElementById('login-msg');
  var email=document.getElementById('email').value.trim();
  var pass=document.getElementById('password').value;
  if(!email || !pass){ msg.textContent='Remplis email et mot de passe.'; return; }
  if(!window.enecSupabase){
    msg.textContent='❌ Supabase non connecté. Vérifie admin-config.js : URL ou clé anon incorrecte.';
    return;
  }
  msg.textContent='Connexion...';
  msg.style.color='#c00';
  try{
    var timeout = new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('Délai dépassé (10s). Vérifie ta connexion internet ou que ton projet Supabase n’est pas en pause.')); }, 10000); });
    var login = window.enecSupabase.auth.signInWithPassword({email:email,password:pass});
    var r = await Promise.race([login, timeout]);
    if(r.error){ msg.textContent='❌ '+r.error.message; return; }
    msg.textContent='✅ Connecté';
    msg.style.color='green';
    showDashboard(r.data.user);
  }catch(e){
    msg.textContent='❌ '+e.message;
  }
}
async function adminLogout(){
  try{ await window.enecSupabase.auth.signOut(); }catch(e){}
  document.getElementById('dashboard').style.display='none';
  document.getElementById('login-box').style.display='block';
}
function showDashboard(user){
  document.getElementById('login-box').style.display='none';
  document.getElementById('dashboard').style.display='block';
  document.getElementById('user-email').textContent=user?user.email:'';
  adminLoadAll();
}
window.addEventListener('DOMContentLoaded', async function(){
  try{
    if(!window.enecSupabase) return;
    var s=await window.enecSupabase.auth.getSession();
    if(s.data && s.data.session && s.data.session.user){ showDashboard(s.data.session.user); }
  }catch(e){}
});
