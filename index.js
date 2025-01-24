import app from './src/app.js';
import Server from './src/server/server.js';
import { environmentConfig } from './src/configs/index.js';
import { createDBConnectionByType } from './src/dbs/index.js';

await createDBConnectionByType(environmentConfig.db.type);

const serverConfig = { ...environmentConfig, app };
const server = Server.createByConfig(serverConfig);
server.start();
