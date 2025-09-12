# Studio Immobiliare Aurora — Sito statico

Sito vetrina statico per agenzia di consulenze immobiliari: homepage, servizi, chi siamo e contatti con form (mailto) e mappa.

## Struttura

- `index.html`: homepage
- `servizi.html`: servizi in dettaglio
- `chi-siamo.html`: pagina aziendale
- `contatti.html`: contatti con form e mappa
- `assets/css/style.css`: stile responsive
- `assets/js/main.js`: interazioni (menu mobile, anno footer, submit mailto)
- `assets/img/`: logo e OpenGraph

## Avvio locale

Serve solo un server statico (percorso assoluto degli asset). Esempi:

### Python
```bash
cd /workspace
python3 -m http.server 8080
```
Apri `http://localhost:8080`.

### Node (serve)
```bash
npm -g i serve
serve -l 8080 /workspace
```

## Deploy

- GitHub Pages / Netlify / Vercel: pubblica la cartella `/workspace` come sito statico.
- Imposta il dominio e HTTPS dal provider.

## Personalizzazione

- Contatti: modifica email e telefono in `index.html`, `contatti.html` e `assets/js/main.js`.
- Indirizzo: aggiorna indirizzo e link Google Maps in `contatti.html`.
- Branding: sostituisci `assets/img/logo.svg` e `assets/img/og-image.svg`.
- Testi: aggiorna titoli e descrizioni nelle pagine.
- SEO: verifica `title`, `meta description`, OpenGraph, JSON‑LD.

## Accessibilità

- Navigazione tastiera supportata; etichette form e `aria-expanded` sul menu mobile.
- Contrasto elevato e focus visibile.

## Licenza

Uso libero, nessuna garanzia.