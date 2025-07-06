# Deploy su Render - Guida Completa

## Setup Deploy Gratuito

1. **Vai su [render.com](https://render.com)** e crea account
2. **Connect Repository**: Collega il repository GitHub `WebVetrina-Pro`
3. **Crea Web Service**:
   - Name: `webvetrina-pro`
   - Environment: `Node`
   - Region: `Frankfurt` (più vicino all'Italia)
   - Branch: `main`
   - Build Command: `cd client && npx vite build --outDir ../dist/public --emptyOutDir && cd .. && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`
   - Start Command: `NODE_ENV=production node dist/index.js`
   - Plan: **Free**

4. **Crea Database PostgreSQL**:
   - Name: `webvetrina-db`
   - Plan: **Free**
   - Region: `Frankfurt`

5. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = [Auto-generated from database]

## Setup Ping Service Gratuito (UptimeRobot)

1. **Vai su [uptimerobot.com](https://uptimerobot.com)** e crea account gratuito
2. **Add New Monitor**:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `WebVetrina Pro`
   - URL: `https://webvetrina-pro.onrender.com` (URL del tuo sito Render)
   - Monitoring Interval: `5 minutes`
3. **Salva**: Il ping inizierà automaticamente

## Database Setup

Dopo il primo deploy:
1. Vai su Render Dashboard → Database → `webvetrina-db`
2. Apri **PSQL Console**
3. Copia e incolla il contenuto di `database-schema.sql`
4. Esegui per creare tutte le tabelle

## Risultato

- **Costo**: $0/mese
- **Uptime**: ~90% (con ping service)
- **Risveglio**: ~10-15 secondi quando dormiente
- **URL**: `https://webvetrina-pro.onrender.com`

## Login Admin

- Username: `atuamadre`
- Password: `piacestacapocchia`
- URL Admin: `https://webvetrina-pro.onrender.com/admin`