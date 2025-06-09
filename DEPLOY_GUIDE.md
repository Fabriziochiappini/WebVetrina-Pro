# 🚀 Guida Deploy su Netlify - Passo per Passo

## Cosa Ti Serve (5 minuti di preparazione)
1. Account Netlify (gratuito)
2. Account Supabase per il database (gratuito)
3. Il codice già collegato a GitHub ✅

---

## PASSO 1: Configurare il Database (10 minuti)

### Su Supabase:
1. Vai su **supabase.com** e registrati
2. Clicca **"New Project"**
3. Scegli un nome (es: "webpro-italia-db")
4. Crea password sicura e salvala
5. Aspetta che il progetto si crei (2-3 minuti)

### Ottenere la Connection String:
1. Nel progetto Supabase, vai su **Settings** → **Database**
2. Scorri fino a **"Connection String"** → **"URI"**
3. Copia la stringa che inizia con `postgresql://`
4. Sostituisci `[YOUR-PASSWORD]` con la password che hai creato

**Esempio:**
```
postgresql://postgres:MiaPassword123@db.xyz.supabase.co:5432/postgres
```

---

## PASSO 2: Deploy su Netlify (5 minuti)

### Su Netlify:
1. Vai su **netlify.com** e accedi con GitHub
2. Clicca **"New site from Git"**
3. Scegli **GitHub** come provider
4. Seleziona il repository del progetto
5. Configurazioni automatiche (grazie al file netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `netlify/functions`
6. Clicca **"Deploy site"**

**Il primo deploy fallirà** - è normale! Mancano le variabili d'ambiente.

---

## PASSO 3: Configurare Variabili d'Ambiente (3 minuti)

### Su Netlify:
1. Vai nel tuo sito deployato
2. **Site settings** → **Environment variables**
3. Aggiungi queste variabili una per una:

```
DATABASE_URL = la-tua-connection-string-completa-di-supabase
SESSION_SECRET = una-frase-lunga-e-casuale-almeno-32-caratteri
TINYMCE_API_KEY = il-tuo-api-key-tinymce
NODE_ENV = production
```

**Per SESSION_SECRET usa qualcosa tipo:**
```
il-mio-sito-webpro-italia-super-segreto-2024-chiave-molto-lunga
```

---

## PASSO 4: Ri-deploy (1 minuto)

1. Torna su **Deploys**
2. Clicca **"Trigger deploy"** → **"Deploy site"**
3. Aspetta 2-3 minuti
4. Il sito sarà online!

---

## PASSO 5: Configurare Database Schema (2 minuti)

Ora devi creare le tabelle nel database:

1. Nel progetto Supabase, vai su **SQL Editor**
2. Clicca **"New query"**
3. Copia tutto il contenuto del file **database-schema.sql** e incollalo
4. Clicca **"Run"** per creare tutte le tabelle

**Login Admin di default:**
- Username: `admin`
- Password: `admin123`
- Cambia la password dopo il primo accesso!

---

## Risultato Finale

Il tuo sito sarà accessibile su un URL tipo:
**https://nome-progetto-xyz123.netlify.app**

Potrai:
- ✅ Gestire portfolio dal pannello admin
- ✅ Pubblicare articoli nel blog
- ✅ Ricevere contatti via form
- ✅ Upload immagini
- ✅ Tutte le funzionalità dinamiche

---

## Se Qualcosa Non Funziona

**Errori comuni:**
- Database connection: Verifica la connection string
- Build errors: Controlla i log su Netlify
- API errors: Verifica le variabili d'ambiente

**Dove cercare aiuto:**
- Log deploy: Netlify → Site → Deploys → Click sul deploy
- Function logs: Netlify → Functions → Logs
- Database: Supabase → Logs