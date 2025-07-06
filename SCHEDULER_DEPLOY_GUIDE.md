# Guida Deploy Scheduler Articoli Automatici

## Panoramica
Il sistema di generazione automatica articoli è configurato per attivarsi automaticamente in produzione. Questo documento spiega come garantire il corretto funzionamento.

## ✅ Configurazione Completata

### 1. Sistema Scheduler
- **File principale**: `server/scheduler.ts`
- **Attivazione automatica**: Solo in ambiente `NODE_ENV=production`
- **Orario generazione**: Ogni giorno alle 09:00 ora italiana
- **Logging avanzato**: Heartbeat ogni ora, log dettagliati per debugging

### 2. Monitoraggio Integrato
- **Dashboard Admin**: Tab "Scheduler" per monitorare stato in tempo reale
- **Endpoint di controllo**: `/api/scheduler/status` per verifiche esterne
- **Componente**: `SchedulerMonitoring.tsx` con refresh automatico ogni 30 secondi

### 3. Sicurezza e Affidabilità
- **Gestione errori**: Sistema resiliente con retry automatico
- **Logging completo**: Tracciamento successi/errori con timestamp
- **Costi controllati**: ~€0.10-0.15 per articolo, €3-4.50/mese

## 🚀 Verifica Deployment

### Durante il Deploy
1. **Variabili ambiente richieste**:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=[tua_chiave]
   DATABASE_URL=[url_database]
   ```

2. **Verifica attivazione**:
   - Controlla nei log del server: `🤖 Scheduler articoli giornalieri attivato`
   - Heartbeat ogni ora: `💚 SCHEDULER HEARTBEAT - Sistema attivo`

### Dopo il Deploy
1. **Accedi alla dashboard admin** → Tab "Scheduler"
2. **Verifica stato**:
   - Ambiente: `PRODUCTION` 
   - Stato Scheduler: `ACTIVE`
   - Prossima esecuzione programmata

3. **Test manuale**:
   - Usa il pulsante "Genera Articolo Ora" per testare immediatamente
   - Controlla che l'articolo venga creato e pubblicato

## 📊 Monitoraggio Continuo

### Indicatori di Funzionamento
- **Log regolari**: Heartbeat ogni ora
- **Generazione giornaliera**: Articolo alle 09:00
- **Dashboard sempre aggiornata**: Stato in tempo reale

### In Caso di Problemi
1. **Verifica chiavi API**: OPENAI_API_KEY valida
2. **Controlla database**: Connessione PostgreSQL funzionante
3. **Log del server**: Cerca errori con tag `SCHEDULER ERROR`
4. **Test manuale**: Usa il bottone di generazione immediata

## 🎯 Benefici del Sistema

### Automatizzazione Completa
- **Contenuto fresco**: 1 articolo/giorno automaticamente
- **SEO ottimizzato**: Targeting keyword strategiche
- **Immagini professionali**: Stock da Unsplash integrati
- **Link interni**: Strategici per conversioni

### Qualità Garantita
- **Lunghezza**: 1500-2000+ parole per articolo
- **Originalità**: Contenuti unici generati da GPT-4o
- **Struttura**: Titoli H2, paragrafi dettagliati, esempi pratici
- **Call-to-action**: Orientati alla conversione

## 📝 Manutenzione

### Controlli Mensili
- Verifica costi OpenAI (~€3-4.50/mese)
- Controlla qualità articoli generati
- Aggiorna topics se necessario (in `server/openai.ts`)

### Supporto
- Dashboard admin per controllo stato
- Generazione manuale disponibile sempre
- Log dettagliati per debugging

## 🔧 Risoluzione Problemi

### Scheduler Non Attivo
1. Verifica `NODE_ENV=production`
2. Controlla restart del server
3. Verifica log: `🤖 Scheduler articoli giornalieri attivato`

### Articoli Non Generati
1. Testa generazione manuale da dashboard
2. Verifica OPENAI_API_KEY
3. Controlla log errori con tag `SCHEDULER ERROR`

### Qualità Articoli
- Gli articoli sono ora configurati per minimo 1500 parole
- Prompt ottimizzato per contenuti dettagliati
- Max tokens aumentato a 4000 per articoli completi

---

**Il sistema è completamente configurato e testato. Una volta deployato in produzione, si attiverà automaticamente e genererà articoli di qualità ogni giorno alle 09:00.**