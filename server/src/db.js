import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

// Toglie gli errori di incollaggio più comuni: spazi, virgolette o testo prima di "mongodb+srv://"
function cleanUri(raw) {
  const s = (raw ?? '').trim().replace(/["'\s]+$/, '');
  const start = s.search(/mongodb(\+srv)?:\/\//);
  return start >= 0 ? s.slice(start) : s;
}

export async function connectDb() {
  let uri = cleanUri(process.env.MONGODB_URI);

  if (uri && !/^mongodb(\+srv)?:\/\//.test(uri)) {
    // Il valore non viene stampato perché potrebbe contenere la password
    throw new Error('MONGODB_URI non valida: non contiene "mongodb+srv://". Reincolla la stringa di Atlas.');
  }

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI mancante: impostala nelle variabili d\'ambiente');
    }
    // In sviluppo avvia un MongoDB locale che salva i dati in server/.data
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.data');
    fs.mkdirSync(dbPath, { recursive: true });
    const mongod = await MongoMemoryServer.create({
      instance: { dbPath, storageEngine: 'wiredTiger', port: 27999 },
    });
    uri = mongod.getUri('gestione-spese');
    console.log('Database di sviluppo locale (server/.data)');
  }

  await mongoose.connect(uri);
}
