import app from './src/app.js';
import Server from './src/server/server.js';
import { AppConfig } from './src/configs/index.js';

import { createDBConnection } from './src/dbs/index.js';

const DBconnection = createDBConnection();
await DBconnection.connect();

const serverConfig = { ...AppConfig, app };
const server = Server.createByConfig(serverConfig);
server.start();
