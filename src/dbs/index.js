import { DatabaseType } from '../configs/index.js';
import { MongoConnectionFactory } from './mongo/mongo-connection.js';
// import { MySQLConnectionFactory } from './mysql/mysql-connection.js';

export const createDBConnectionByType = async (databaseType) => {
    switch (databaseType) {
        case DatabaseType.MONGO:
            return await MongoConnectionFactory.createConnection();
        default:
            throw new Error('Database not supported');
    }
};
