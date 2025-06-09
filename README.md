# WebPro Italia - Sito Web Professionale

Piattaforma web professionale per la vendita di siti web responsive e moderni per il mercato italiano.

## 🚀 Deploy su Netlify

### Prerequisiti
- Account GitHub (già configurato)
- Account Netlify (gratuito)
- Database PostgreSQL (Supabase consigliato)

### Passo 1: Configurazione Netlify
1. Vai su [netlify.com](https://netlify.com) e accedi
2. Clicca "New site from Git"
3. Seleziona GitHub e autorizza
4. Scegli questo repository
5. Configurazioni build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`

### Passo 2: Database Setup (Supabase)
1. Vai su [supabase.com](https://supabase.com)
2. Crea nuovo progetto
3. Vai in Settings > Database
4. Copia la "Connection string"
5. Sostituisci `[YOUR-PASSWORD]` con la password del database

### Passo 3: Variabili d'Ambiente su Netlify
Nella dashboard Netlify, vai in Site settings > Environment variables:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
SESSION_SECRET=una-chiave-segreta-molto-lunga-e-casuale
TINYMCE_API_KEY=il-tuo-api-key-tinymce
NODE_ENV=production
```

### Passo 4: Deploy
1. Fai push del codice su GitHub
2. Netlify farà automaticamente il deploy
3. Il sito sarà disponibile su un URL tipo: `https://nome-sito.netlify.app`

## 🛠 Tecnologie Utilizzate

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL
- **Build**: Vite per il frontend, ESBuild per il backend
- **Hosting**: Netlify con funzioni serverless
- **Database**: PostgreSQL (compatibile con Supabase, Railway, etc.)

## 📁 Struttura del Progetto

```
├── client/          # Frontend React
├── server/          # Backend Express.js
├── shared/          # Schemi database condivisi
├── netlify/         # Funzioni Netlify
├── uploads/         # File caricati dagli utenti
└── netlify.toml     # Configurazione Netlify
```

## 🔧 Comandi Utili

```bash
npm run dev          # Sviluppo locale
npm run build        # Build per produzione
npm run db:push      # Aggiorna schema database
```

## 📞 Supporto

Per problemi tecnici o configurazione, contatta il team di sviluppo.