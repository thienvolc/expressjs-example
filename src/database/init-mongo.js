import mongoose from 'mongoose';
import { config } from '../configs/index.js';
import { EnvironmentType } from '../configs/environment/environment-config.js';

class MongoDatabase {
    static instance = null;

    static getInstance = () => {
        if (!MongoDatabase.instance) {
            MongoDatabase.instance = new MongoDatabase();
        }
        return MongoDatabase.instance;
    };

    constructor() {
        this.setDebugIfNotProduction();
        this.createConnection();
    }

    setDebugIfNotProduction = () => {
        if (config.environment !== EnvironmentType.PRODUCTION) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
    };

    createConnection = () => {
        const connectUri = this.getUri();
        const options = { maxPoolSize: 100 };
        mongoose
            .connect(connectUri, options)
            .then(() => console.log('Connected to MongoDB successfully'))
            .catch((error) => console.error('Error connecting to MongoDB: ', error));
    };

    getUri = () => {
        return this.isSecure() ? this.getSecureUri() : this.getNormalUri();
    };

    isSecure = () => {
        return !!config.database.user && !!config.database.password;
    };

    getSecureUri = () => {
        const { user, password, host, port, name } = config.database;
        return `mongodb://${user}:${password}@${host}:${port}/${name}`;
    };

    getNormalUri = () => {
        const { host, port, name } = config.database;
        return `mongodb://${host}:${port}/${name}`;
    };
}

export default MongoDatabase;
