import express, { Request, Response, json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import Database from 'better-sqlite3';
import { getUserList, login } from './controllers/userController';
import { addDevice, deleteDevice, getDeviceList, getScreenSizeList, pingDevice } from './controllers/deviceController';

const app: express.Application = express();
const port: number = 80;

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
app.post('/api/login', login);
app.get('/api/user/list', getUserList);
app.post('/api/device', addDevice);
app.get('/api/device/list', getDeviceList);
app.delete('/api/device', deleteDevice);
app.get('/api/screenSize/list', getScreenSizeList);
app.get('/api/ping', pingDevice);

app.get('*', (request: Request, response: Response) => response.sendFile(path.join(__dirname, 'dist', 'index.html')));

// Server Run
app.listen(port, () => console.log(`App is listening on port ${port} \n`));
