import app from './app.js';
import { AppConfig } from './config/index.js';
import { createDBConnection } from './dbs/index.js';

createDBConnection();

const runApp = (port, host) => {
    app.listen(port, host, () => {
        console.log(`Server is running on ${host}:${port}`);
    });
};

runApp(AppConfig.port, AppConfig.host);
