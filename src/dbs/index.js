import { DBType } from '../configs/index.js';
import { MongoConnectionSingletonFactory } from './mongo/mongo-connection.js';
// import { MySQLConnectionSingletonFactory } from './mysql/mysql-connection.js';

export const createDBConnectionByType = (dbType) => {
    switch (dbType) {
        case DBType.MONGO:
            return MongoConnectionSingletonFactory.createConnection();
        default:
            throw new Error('Database not supported');
    }
};
