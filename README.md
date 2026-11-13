# ENEC — index.html retravaillé : Vitrine + Admin (GitHub + Supabase)

**Ce dossier part EXACTEMENT de ton fichier `index.html` partagé** (vitrine React compilée, logo, photos, textes conservés).
On y a greffé, sans toucher à la vitrine :
- Bouton flottant **🔐 Espace Admin** en bas à droite
- Panneau admin : connexion Supabase Auth, Services, Lauréats, Messages, Paramètres
- Fichiers `supabase-config.js` + `app-admin.js` + `supabase-schema.sql`

## 1. GitHub
```bash
git init
git add .
git commit -m "ENEC vitrine + admin Supabase (index retravaillé)"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/enec-site.git
git push -u origin main
```
Déploie ensuite avec **GitHub Pages** (Settings → Pages → main / root) ou **Netlify → Import from GitHub**.
⚠️ `index.html` fait ~9,5 Mo (images intégrées) : GitHub l'accepte (< 100 Mo), mais pour alléger plus tard, mets les photos dans Supabase Storage.

## 2. Supabase
1. https://supabase.com/dashboard → New project → nom `enec`, région Frankfurt.
2. SQL Editor → colle tout `supabase-schema.sql` → Run (crée services / laureats / messages / settings + RLS + 9 services par défaut).
3. Authentication → Users → Add user → ex `admin@enec.cd` + mot de passe fort → Auto Confirm.
4. Storage → Create bucket `laureats` → **Public** ON (photos des lauréats).
5. Settings → API → copie **Project URL** + **anon public key** → colle dans `supabase-config.js` → commit + push.

## 3. Tester
- Ouvre le site → bouton **🔐 Espace Admin** → connecte-toi avec ton compte Supabase.
- Ajoute un service / lauréat → visible dans l'admin + sauvegardé dans Supabase.
- Sans Supabase : mode démo `admin@enec.cd / enec2026` pour tester l'interface.
- Pour enregistrer un message du formulaire Contact dans Supabase, appelle `enecSendMessage({nom,email,telephone,service,message})` depuis ton formulaire (déjà disponible dans `app-admin.js`).

## Sécurité
- Utilise **uniquement la clé ANON** dans `supabase-config.js`. Jamais la clé `service_role` sur GitHub.
- RLS : public = lecture services/lauréats + envoi de message. Seul un admin connecté peut modifier/supprimer.

© 2026 ENEC — Tous droits réservés.
