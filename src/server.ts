import express, { Request, Response, json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import Database from 'better-sqlite3';
import { getAdMain } from './controllers/adController';

const app: express.Application = express();
const port: number = 4001;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

// DB 연동
const db_name = path.join('ad-admin.db');
const db = new Database(db_name, { verbose: () => console.log('query success') });
app.use((req, res, next) => {
  (req as any).db = db;
  next();
});

// build된 react web app 파일들을 제공
app.use(express.static(path.join(__dirname, 'dist')));

// Router
app.get('/', (request: Request, response: Response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// API
app.get('/ad/main', getAdMain);

// Server Run
app.listen(port, () => console.log(`App is listening on port ${port} \n`));
