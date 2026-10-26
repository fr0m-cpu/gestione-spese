import 'dotenv/config';
import { createApp } from './app.js';
import { connectDb } from './db.js';

const port = process.env.PORT || 4000;

await connectDb();
createApp().listen(port, () => {
  console.log(`API in ascolto su http://localhost:${port}`);
});
