// ENEC - Bilingue FR / EN - VERSION CORRIGÉE v9
var ENEC_LANG = 'fr';
try { ENEC_LANG = localStorage.getItem('enec_lang') || 'fr'; } catch(e){ ENEC_LANG = 'fr'; }

var ENEC_TEXT = {
  fr: {
    nav_accueil: "Accueil", nav_apropos: "À propos", nav_equipe: "Notre équipe",
    nav_domaines: "Domaines", nav_realisations: "Réalisations", nav_programme: "Programme",
    nav_actualites: "Actualités", nav_contact: "Contact",
    hero_titre: "Un nouvel espoir, de multiples opportunités !",
    hero_texte: "Bienvenue chez ENEC. Formations professionnelles, services et solutions commerciales à Bukavu, Sud-Kivu.",
    btn_whatsapp: "💬 WhatsApp", btn_contact: "Nous contacter",
    apropos_titre: "À propos de ENEC",
    apropos_texte: "ENEC est une entreprise congolaise basée à Bukavu. Notre mission est d'offrir des formations pratiques, des services professionnels et des solutions adaptées au contexte local.",
    mission_titre: "Notre Mission", mission_texte: "Former, accompagner et connecter les talents et les entreprises du Congo.",
    vision_titre: "Notre Vision", vision_texte: "Un Congo où chaque jeune et chaque entrepreneur a les outils pour réussir.",
    valeurs_titre: "Nos Valeurs",
    equipe_titre: "Notre équipe", equipe_texte: "Une équipe locale, engagée et polyvalente.",
    domaines_titre: "Nos domaines d'intervention", domaines_texte: "9 domaines, une seule coordination.",
    realisations_titre: "Nos réalisations",
    programme_titre: "Programme d'Appui aux Entrepreneurs",
    programme_texte: "Nous accompagnons les entrepreneurs : idée, business plan, formation, mise en relation et suivi.",
    actualites_titre: "Nos actualités",
    contact_titre: "Nous contacter",
    contact_adresse: "Adresse :", contact_tel: "Téléphones :", contact_email: "Email :",
    contact_horaires: "Horaires :", contact_horaires_val: "Lun - Ven : 08h00 - 17h00, Sam : 09h00 - 13h00",
    contact_btn: "💬 Écrire sur WhatsApp",
    footer_nom: "ENEC - Entreprise Nouvel Espoir du Congo",
    footer_slogan: "Un nouvel espoir, de multiples opportunités !",
    footer_droits: "© 2026 ENEC - Tous droits réservés. Bukavu, Sud-Kivu, RDC"
  },
  en: {
    nav_accueil: "Home", nav_apropos: "About", nav_equipe: "Our Team",
    nav_domaines: "Areas", nav_realisations: "Achievements", nav_programme: "Programme",
    nav_actualites: "News", nav_contact: "Contact",
    hero_titre: "A new hope, multiple opportunities!",
    hero_texte: "Welcome to ENEC. Professional training, services and business solutions in Bukavu, South Kivu.",
    btn_whatsapp: "💬 WhatsApp", btn_contact: "Contact us",
    apropos_titre: "About ENEC",
    apropos_texte: "ENEC is a Congolese company based in Bukavu. Our mission is to provide practical training, professional services and solutions adapted to the local context.",
    mission_titre: "Our Mission", mission_texte: "To train, support and connect the talents and companies of Congo.",
    vision_titre: "Our Vision", vision_texte: "A Congo where every young person and every entrepreneur has the tools to succeed.",
    valeurs_titre: "Our Values",
    equipe_titre: "Our Team", equipe_texte: "A local, committed and versatile team.",
    domaines_titre: "Our areas of intervention", domaines_texte: "9 areas, one coordination.",
    realisations_titre: "Our achievements",
    programme_titre: "Entrepreneur Support Programme",
    programme_texte: "We support entrepreneurs: idea, business plan, training, networking and follow-up.",
    actualites_titre: "Our news",
    contact_titre: "Contact us",
    contact_adresse: "Address:", contact_tel: "Phones:", contact_email: "Email:",
    contact_horaires: "Hours:", contact_horaires_val: "Mon - Fri: 08:00 - 17:00, Sat: 09:00 - 13:00",
    contact_btn: "💬 Write on WhatsApp",
    footer_nom: "ENEC - New Hope Company of Congo",
    footer_slogan: "A new hope, multiple opportunities!",
    footer_droits: "© 2026 ENEC - All rights reserved. Bukavu, South Kivu, DRC"
  }
};

function enecApplyLang(lang){
  ENEC_LANG = lang;
  try{ localStorage.setItem('enec_lang', lang); }catch(e){}
  document.documentElement.lang = lang;
  var T = ENEC_TEXT[lang] || ENEC_TEXT.fr;
  var els = document.querySelectorAll('[data-i18n]');
  for(var i=0;i<els.length;i++){
    var key = els[i].getAttribute('data-i18n');
    if(T[key]) els[i].textContent = T[key];
  }
  var btns = document.querySelectorAll('.lang button');
  for(var j=0;j<btns.length;j++){
    if(btns[j].getAttribute('data-lang')===lang) btns[j].classList.add('active');
    else btns[j].classList.remove('active');
  }
}

function enecSetLang(lang){
  enecApplyLang(lang);
  // Re-appliquer après le chargement Supabase qui peut écraser le texte
  setTimeout(function(){ enecApplyLang(lang); }, 500);
  setTimeout(function(){ enecApplyLang(lang); }, 1500);
}

function enecInitLang(){
  var lang = 'fr';
  try{ lang = localStorage.getItem('enec_lang') || 'fr'; }catch(e){}
  enecApplyLang(lang);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', enecInitLang);
} else {
  enecInitLang();
  }
