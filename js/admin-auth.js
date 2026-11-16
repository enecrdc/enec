// ENEC Admin Auth - Supabase Auth uniquement, jamais de service_role
async function adminLogin(){
  var email = document.getElementById('email').value.trim();
  var pass = document.getElementById('password').value;
  var msg = document.getElementById('login-msg');
  if(!email || !pass){ msg.textContent = 'Entre ton email et ton mot de passe.'; return; }
  msg.textContent = 'Connexion...';
  try{
    var r = await window.enecSupabase.auth.signInWithPassword({ email: email, password: pass });
    if(r.error) throw r.error;
    msg.textContent = ''; msg.className = 'msg ok';
    adminAfterLogin();
  }catch(e){ msg.textContent = 'Erreur : ' + (e.message || e); }
}
async function adminLogout(){
  try{ await window.enecSupabase.auth.signOut(); }catch(e){}
  location.reload();
}
async function adminCheckSession(){
  try{
    var r = await window.enecSupabase.auth.getSession();
    if(r.data && r.data.session){
      document.getElementById('user-email').textContent = r.data.session.user.email;
      adminAfterLogin();
    } else {
      document.getElementById('login-box').style.display = 'block';
      document.getElementById('dashboard').style.display = 'none';
    }
  }catch(e){
    document.getElementById('login-box').style.display = 'block';
  }
}
function adminAfterLogin(){
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  if(typeof adminLoadAll === 'function') adminLoadAll();
}
document.addEventListener('DOMContentLoaded', adminCheckSession);
