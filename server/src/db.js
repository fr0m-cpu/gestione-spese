import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

export async function connectDb() {
  let uri = process.env.MONGODB_URI;

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
