import { AppConfig, DBConfig, DBType, isDevEnvironment } from '../config/index.js';
import { MongoConnectionSingletonFactory } from './mongo/mongo-connection.js';

// import { MySQLConnectionSingletonFactory } from './mysql/mysql-connection.js';

export const createDBConnection = async () => {
    const dbConnection = createDBConnectionByType(DBConfig.type);
    dbConnection.setConfig(DBConfig);
    setupForDevelopment(dbConnection);
    await dbConnection.connect();
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
    if (isDevEnvironment(AppConfig.environment)) {
        dbConnection.setDebug();
        dbConnection.setSafePoolSize();
    }
};
