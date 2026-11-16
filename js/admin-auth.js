// ENEC Admin Auth - Corrigé : vérifie que Supabase existe avant login
function adminGetClient(){
  return window.enecSupabase || window.supabaseClient || null;
}

async function adminLogin(){
  var email = document.getElementById('email').value.trim();
  var pass = document.getElementById('password').value;
  var msg = document.getElementById('login-msg');
  var client = adminGetClient();
  if(!client){
    msg.textContent = 'Erreur : Supabase non connecté. Vérifie admin-config.js (URL + clé ANON) et js/supabase.js, puis recharge la page.';
    return;
  }
  if(!email || !pass){ msg.textContent = 'Entre ton email et ton mot de passe.'; return; }
  msg.textContent = 'Connexion...';
  try{
    var r = await client.auth.signInWithPassword({ email: email, password: pass });
    if(r.error) throw r.error;
    msg.textContent = ''; msg.className = 'msg ok';
    adminAfterLogin();
  }catch(e){ msg.textContent = 'Erreur : ' + (e.message || e); }
}

async function adminLogout(){
  var client = adminGetClient();
  try{ if(client) await client.auth.signOut(); }catch(e){}
  location.reload();
}

async function adminCheckSession(){
  var client = adminGetClient();
  if(!client){
    document.getElementById('login-box').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    return;
  }
  try{
    var r = await client.auth.getSession();
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
