# Gestione Spese

Web app per tenere traccia di spese, entrate e risparmi, con il saldo sempre aggiornato.
Si installa sul telefono come un'app (PWA).

**Funzioni**

- Account personale con registrazione e login
- Spese ed entrate per categoria, con saldo totale e disponibile
- Obiettivi di risparmio con barra di avanzamento, versamenti e prelievi
- Budget mensile per categoria, con avviso all'80% e oltre il limite
- Grafici: spese per categoria e andamento degli ultimi 6 mesi
- Aggiornamento automatico: dopo ogni modifica, al ritorno sull'app e ogni 30 secondi
- Eliminazione dell'account e di tutti i dati

**Tecnologie:** React + Vite, Node.js + Express, MongoDB (Mongoose), Recharts.

## Avvio in locale

Serve Node.js 20 o successivo.

```bash
npm install
npm run dev
```

Apri http://localhost:5173. Senza `MONGODB_URI` il server usa un database locale salvato in `server/.data`
(al primo avvio lo scarica, serve qualche minuto).

Per provare la versione compilata (come in produzione):

```bash
npm run build
npm start
```

e apri http://localhost:4000.

## Pubblicazione

1. Crea un database gratuito su [MongoDB Atlas](https://www.mongodb.com/atlas) e copia la stringa di connessione.
2. Carica il progetto su GitHub.
3. Su [Render](https://render.com) scegli **New → Blueprint** e seleziona il repository: `render.yaml` configura tutto.
4. Inserisci `MONGODB_URI` quando richiesto. `JWT_SECRET` viene generato in automatico.

## Struttura

```
client/   frontend React (pagine in src/pages, componenti in src/components)
server/   API Express (rotte in src/routes, modelli in src/models.js)
```

Gli importi sono salvati in centesimi per evitare errori di arrotondamento.
