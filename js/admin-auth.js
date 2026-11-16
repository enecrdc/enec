async function adminLogin(){
  var msg=document.getElementById('login-msg');
  var email=document.getElementById('email').value.trim();
  var pass=document.getElementById('password').value;
  if(!email || !pass){ msg.textContent='Remplis email et mot de passe.'; return; }
  msg.textContent='Connexion...';
  var r=await window.enecSupabase.auth.signInWithPassword({email:email,password:pass});
  if(r.error){ msg.textContent='❌ '+r.error.message; return; }
  msg.textContent='✅ Connecté';
  showDashboard(r.data.user);
}
async function adminLogout(){
  await window.enecSupabase.auth.signOut();
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
  var s=await window.enecSupabase.auth.getSession();
  if(s.data && s.data.session && s.data.session.user){ showDashboard(s.data.session.user); }
});
