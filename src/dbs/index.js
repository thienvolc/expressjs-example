import { AppConfig, DBConfig, DBType, isDevEnvironment } from '../configs/index.js';
import { MongoConnectionSingletonFactory } from './mongo/mongo-connection.js';

// import { MySQLConnectionSingletonFactory } from './mysql/mysql-connection.js';

export const createDBConnection = () => {
    const DBconnection = createDBConnectionByType(DBConfig.type);
    setupForDevelopment(DBconnection);
    return DBconnection;
};

const createDBConnectionByType = (dbType) => {
    switch (dbType) {
        case DBType.MONGO:
            return MongoConnectionSingletonFactory.createConnection();
        default:
            throw new Error('Database not supported');
    }
};

export const setupForDevelopment = (DBconnection) => {
    DBconnection.setConfig(DBConfig);
    if (isDevEnvironment(AppConfig.environment)) {
        DBconnection.setDebug();
        DBconnection.setSafePoolSize();
    }
};
