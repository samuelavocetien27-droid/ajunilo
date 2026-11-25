# AJUNILO BUSINESS+ — Boutique informatique

Next.js 14 · TypeScript · Tailwind · Supabase (base, auth, stockage) · Vercel.
Aucune clé secrète n'est utilisée : seule la clé publique « anon » est dans le navigateur, la sécurité est assurée par les politiques RLS de `supabase/schema.sql`.

## 1. Créer le projet Supabase (gratuit)
1. Créez un compte sur supabase.com → **New project** (choisissez la région la plus proche, notez le mot de passe de la base).
2. **SQL Editor → New query** : collez tout `supabase/schema.sql` → **Run**.
3. **Authentication → Users → Add user** : saisissez votre e-mail et un mot de passe fort (cochez « Auto Confirm User »).
4. Dans le SQL Editor, exécutez (avec VOTRE e-mail) :
   `insert into public.admin_users (user_id) select id from auth.users where email = 'vous@exemple.com';`
   Répétez pour ajouter d'autres administrateurs (créez d'abord leur utilisateur).
5. **Project Settings → API** : copiez **Project URL** et la clé **anon public** (jamais la clé `service_role`).

## 2. Tester en local (facultatif)
```
cp .env.example .env.local   # collez URL et clé anon
npm install
npm run dev
```
Ouvrez http://localhost:3000/admin/login.

## 3. Mettre en ligne sur Vercel (gratuit)
1. Créez un dépôt GitHub et envoyez-y ce dossier (sans `node_modules`).
2. Sur vercel.com → **Add New → Project** → importez le dépôt.
3. **Environment Variables** : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (l'adresse https que Vercel vous donne ; vous pouvez l'ajouter après le 1er déploiement puis redéployer).
4. **Deploy**. Domaine personnalisé plus tard : Vercel → Settings → Domains.

## 4. Premiers pas
Connectez-vous sur `/admin` → **Paramètres** : renseignez le numéro WhatsApp (ex. `229XXXXXXXX`), le nom, le logo, les coordonnées → puis **Produits → Ajouter un ordinateur**.
