import dotenv from 'dotenv';
import { DBType, MongoDBConfig, MySQLDBConfig, InMemoryMockDBConfig } from '../db/index.js';

export const EnvironmentType = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};

export const isDevEnvironment = (environmentType) => environmentType === EnvironmentType.DEVELOPMENT;
export const isProdEnvironment = (environmentType) => environmentType === EnvironmentType.PRODUCTION;
export const isValidEnvironmentType = (environmentType) => Object.values(EnvironmentType).includes(environmentType);

export class EnvironmentConfigLoader {
    constructor(filePath) {
        this.filePath = filePath;
    }

    load = () => {
        dotenv.config({ path: this.filePath });
    };
}

class EnvironmentFilePathHandler {
    static getFilePath = (baseFilePath, environmentType) =>
        environmentType ? `${baseFilePath}.${environmentType}` : baseFilePath;
}

export class EnvironmentConfig {
    constructor(baseFilePath) {
        this.baseFilePath = baseFilePath;
        this.environmentType = null;
        this.dbConfigStrategy = null;
    }

    setEnvironmentType = (environmentType) => {
        if (!isValidEnvironmentType(environmentType)) {
            throw new Error('Invalid environment type!');
        }
        this.environmentType = environmentType;
    };

    setDatabaseConfigStrategy = (dbConfigStrategy) => {
        this.dbConfigStrategy = dbConfigStrategy;
    };

    initializeConfig = () => {
        this.loadEnvironmentFile();
        return this.getConfig();
    };

    loadEnvironmentFile = () => {
        const filePath = EnvironmentFilePathHandler.getFilePath(this.baseFilePath, this.environmentType);
        const loader = new EnvironmentConfigLoader(filePath);
        loader.load();
    };

    getConfig = () => {
        return {
            app: this.getApp(),
            db: this.getDatabaseConfig(),
        };
    };

    getApp = () => {
        return {
            host: process.env.HOST,
            port: process.env.PORT,
            environment: this.environmentType,
        };
    };

    getDatabaseConfig = () => {
        if (this.dbConfigStrategy) {
            return this.dbConfigStrategy.getConfig();
        }
        const dbType = process.env.DB_TYPE;
        this.dbConfigStrategy = this.getDatabaseConfigStrategy(dbType);
        return this.dbConfigStrategy.getConfig();
    };

    getDatabaseConfigStrategy = (dbType) => {
        switch (dbType) {
            case DBType.MONGO:
                return new MongoDBConfig();
            case DBType.MYSQL:
                return new MySQLDBConfig();
            default:
                return new InMemoryMockDBConfig();
        }
    };
}
