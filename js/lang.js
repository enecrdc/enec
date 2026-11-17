var ENEC_LANG = {
fr: {
  nav_home:"Accueil", nav_domains:"Domaines", nav_team:"Équipe", nav_work:"Réalisations", nav_news:"Actualités", nav_contact:"Contact",
  hero_badge:"BUKAVU • SUD-KIVU • RDC",
  hero_slogan:"Un nouvel espoir, de multiples opportunités !",
  hero_lead:"Des compétences, des services et des solutions pour bâtir un avenir meilleur.",
  hero_p1:"L'Entreprise Nouvel Espoir du Congo (ENEC) est une entreprise multisectorielle qui œuvre dans la formation, les services professionnels et les solutions commerciales. À travers la diversité de ses domaines d'intervention, elle accompagne les particuliers, les entrepreneurs, les entreprises et les organisations dans le développement de leurs compétences, la réalisation de leurs projets et la concrétisation de leurs ambitions.",
  hero_p2:"De l'éducation à l'entrepreneuriat, des services numériques à l'agriculture, en passant par la communication, la formation professionnelle et l'accompagnement des projets, ENEC met son expertise, son professionnalisme et son esprit d'innovation au service des opportunités et du développement durable.",
  hero_eng_label:"Notre engagement :",
  hero_eng_text:"transformer les compétences en opportunités et les idées en réalisations concrètes.",
  hero_welcome:"Bienvenue chez ENEC, votre partenaire pour apprendre, entreprendre, innover et progresser.",
  hero_btn1:"Découvrir nos domaines d'intervention",
  hero_btn2:"Nous contacter",
  domains_title:"Nos domaines d'intervention", domains_sub:"9 domaines pour vous accompagner.",
  team_title:"Notre Équipe", team_sub:"Une équipe engagée à vos côtés.",
  work_title:"Nos Réalisations", gallery_title:"Galerie Photos", videos_title:"Vidéos", news_title:"Actualités",
  program_title:"Programme d'Appui aux Entrepreneurs",
  contact_title:"Nous contacter", contact_send:"Envoyer"
},
en: {
  nav_home:"Home", nav_domains:"Areas", nav_team:"Team", nav_work:"Achievements", nav_news:"News", nav_contact:"Contact",
  hero_badge:"BUKAVU • SOUTH KIVU • DRC",
  hero_slogan:"A new hope, multiple opportunities!",
  hero_lead:"Skills, services and solutions to build a better future.",
  hero_p1:"The Entreprise Nouvel Espoir du Congo (ENEC) is a multisectoral company working in training, professional services and business solutions. Through the diversity of its areas of intervention, it supports individuals, entrepreneurs, businesses and organisations in developing their skills, carrying out their projects and achieving their ambitions.",
  hero_p2:"From education to entrepreneurship, from digital services to agriculture, through communication, vocational training and project support, ENEC puts its expertise, professionalism and spirit of innovation at the service of opportunities and sustainable development.",
  hero_eng_label:"Our commitment:",
  hero_eng_text:"turning skills into opportunities and ideas into concrete achievements.",
  hero_welcome:"Welcome to ENEC, your partner to learn, undertake, innovate and progress.",
  hero_btn1:"Discover our areas of intervention",
  hero_btn2:"Contact us",
  domains_title:"Our Areas of Intervention", domains_sub:"9 areas to support you.",
  team_title:"Our Team", team_sub:"A committed team by your side.",
  work_title:"Our Achievements", gallery_title:"Photo Gallery", videos_title:"Videos", news_title:"News",
  program_title:"Entrepreneur Support Programme",
  contact_title:"Contact Us", contact_send:"Send"
}
};
function enecSetLang(lang){
  localStorage.setItem('enec_lang', lang);
  document.documentElement.lang = lang;
  var dict = ENEC_LANG[lang] || ENEC_LANG.fr;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k = el.getAttribute('data-i18n');
    if(dict[k]) el.textContent = dict[k];
  });
  document.querySelectorAll('.lang-btn').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-lang')===lang); });
}
window.addEventListener('DOMContentLoaded', function(){ enecSetLang(localStorage.getItem('enec_lang') || 'fr'); });
