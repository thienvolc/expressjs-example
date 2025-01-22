import { config } from '../configs/index.js';
import MongoDatabase from './init-mongo.js';
import { DatabaseType } from '../configs/environment/environment-config.js';

export class DatabaseFactory {
    static createConnection = () => {
        const databaseType = config.database.type;
        switch (databaseType) {
            case DatabaseType.MONGO:
                return MongoDatabase.getInstance();
            default:
                throw new Error('Database not supported');
        }
    };
}
