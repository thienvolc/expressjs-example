import app from './src/app.js';
import Server from './src/server/server.js';
import { AppConfig, DBConfig, isDevEnvironment } from './src/configs/index.js';
console.log("🚀 ~ AppConfig:", AppConfig)
import { createDBConnectionByType } from './src/dbs/index.js';

const connection = createDBConnectionByType(DBConfig.type);
connection.setConfig(DBConfig);
if (isDevEnvironment(AppConfig.environment)) {
    connection.setDebug();
    connection.setSafePoolSize();
}
await connection.connect();

const serverConfig = { ...AppConfig, app };
const server = Server.createByConfig(serverConfig);
server.start();
