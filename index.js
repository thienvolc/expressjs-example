import app from './src/app.js';
import { environmentConfig } from './src/configs/index.js';
import Server from './src/server/server.js';
import { createDBConnectionByType } from './src/dbs/index.js';

const serverConfig = { ...environmentConfig, app };
const server = Server.createByConfig(serverConfig);
server.start();

await createDBConnectionByType(environmentConfig.db.type);
