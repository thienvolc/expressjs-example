import app from './src/app.js';
import { config } from './src/configs/index.js';
import Server from './src/server/server.js';

const serverConfig = { ...config, app: app };
const server = Server.createServerByConfig(serverConfig);

import { DatabaseFactory } from './src/database/index.js';
DatabaseFactory.createConnection();

server.start();
