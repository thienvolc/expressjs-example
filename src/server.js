import app from './app.js';
import { AppConfig } from './config/index.js';
import { ProxyDBConnection } from './database/index.js';

const initializeApp = async () => {
    try {
        await ProxyDBConnection.establishConnection();
        const { host, port } = AppConfig;
        runApp(port, host);
    } catch (error) {
        console.error('Error establishing DB connection:', error);
        process.exit(1);
    }
};

const runApp = (port, host) => {
    app.listen(port, host, () => {
        console.log(`Server is running on ${host}:${port}`);
    });
};

initializeApp();
