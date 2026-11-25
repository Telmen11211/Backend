import 'dotenv/config';
import { app } from './app.js';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);

app.listen(port, host, () => console.info(`Store API listening at http://${host}:${port}`));
