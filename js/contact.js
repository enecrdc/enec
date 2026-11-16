// ENEC - Contact - Table enec_settings
async function enecLoadContact(sb){
  var s = await sb.from('enec_settings').select('*').order('updated_at',{ascending:false}).limit(1).maybeSingle();
  if(s.error || !s.data) return;
  var d = s.data;
  var tel1 = d.contact_tel1||d.telephone1, tel2 = d.contact_tel2||d.telephone2;
  var email = d.contact_email||d.email, adr = d.contact_adresse||d.adresse;
  if(tel1) enecReplaceText("+243 970 204 871", tel1);
  if(tel2) enecReplaceText("+243 962 471 683", tel2);
  if(email){ enecReplaceText("enecbusiness20@gmail.com", email); enecReplaceText("furahahabamungu2005@gmail.com", email); }
  if(adr) enecReplaceText("Avenue de la Bière, Ibanda, Bukavu, Sud-Kivu, RDC", adr);
  var wa = (d.contact_whatsapp||d.whatsapp||'').replace(/[^0-9]/g,'');
  if(wa) [].forEach.call(document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]'), function(a){
    a.setAttribute('href','https://wa.me/'+wa+'?text='+encodeURIComponent('Bonjour ENEC'));
  });
  if(d.contact_facebook) [].forEach.call(document.querySelectorAll('a[href*="facebook.com"]'), function(a){ a.setAttribute('href', d.contact_facebook); });
  if(d.contact_instagram) [].forEach.call(document.querySelectorAll('a[href*="instagram.com"]'), function(a){ a.setAttribute('href', d.contact_instagram); });
  if(d.contact_linkedin) [].forEach.call(document.querySelectorAll('a[href*="linkedin.com"]'), function(a){ a.setAttribute('href', d.contact_linkedin); });
}
