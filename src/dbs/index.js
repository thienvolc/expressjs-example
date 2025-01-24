import { AppConfig, DBConfig, DBType, isDevEnvironment } from '../configs/index.js';
import { MongoConnectionSingletonFactory } from './mongo/mongo-connection.js';

// import { MySQLConnectionSingletonFactory } from './mysql/mysql-connection.js';

export const createDBConnection = () => {
    const dbConnection = createDBConnectionByType(DBConfig.type);
    setupForDevelopment(dbConnection);
    return dbConnection;
};

const createDBConnectionByType = (dbType) => {
    switch (dbType) {
        case DBType.MONGO:
            return MongoConnectionSingletonFactory.createConnection();
        default:
            throw new Error('Database not supported');
    }
};

export const setupForDevelopment = (dbConnection) => {
    dbConnection.setConfig(DBConfig);
    if (isDevEnvironment(AppConfig.environment)) {
        dbConnection.setDebug();
        dbConnection.setSafePoolSize();
    }
};
