import dotenv from 'dotenv';
import { DBType, MongoDBConfig, MySQLDBConfig, InMemoryMockDBConfig } from './dbStrategy.js';

export const isDevEnvironment = (environmentType) => environmentType === EnvironmentType.DEVELOPMENT;

export const isProdEnvironment = (environmentType) => environmentType === EnvironmentType.PRODUCTION;

export const isValidEnvironmentType = (environmentType) => Object.values(EnvironmentType).includes(environmentType);

export const EnvironmentType = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};

const DEFAULT_ENV_BASE_FILE_PATH = './.env';

class EnvironmentConfigLoader {
    #filePath;

    constructor(filePath) {
        this.#filePath = filePath;
    }

    load = () => {
        dotenv.config({ path: this.#filePath });
    };
}

class EnvironmentFilePathHandler {
    static getFilePath = (baseFilePath, environmentType) =>
        environmentType ? `${baseFilePath}.${environmentType}` : baseFilePath;
}

class EnvironmentConfig {
    #baseFilePath;
    #environmentType;
    #dbConfigStrategy;

    constructor(baseFilePath) {
        this.#baseFilePath = baseFilePath;
        this.#environmentType = null;
        this.#dbConfigStrategy = null;
    }

    setEnvironmentType = (environmentType) => {
        if (!isValidEnvironmentType(environmentType)) {
            throw new Error('Environment type is not valid!');
        }
        this.#environmentType = environmentType;
    };

    setStrategy = (dbConfigStrategy) => {
        this.#dbConfigStrategy = dbConfigStrategy;
    };

    initializeConfig = () => {
        this.#loadEnvironmentFile();
        return this.#getConfig();
    };

    #loadEnvironmentFile = () => {
        const filePath = EnvironmentFilePathHandler.getFilePath(this.#baseFilePath, this.#environmentType);
        new EnvironmentConfigLoader(filePath).load();
    };

    #getConfig = () => ({
        app: this.#getApp(),
        db: this.#getDB(),
    });

    #getApp = () => ({
        host: process.env.HOST,
        port: process.env.PORT,
        environment: this.#environmentType,
    });

    #getDB = () => {
        if (this.#dbConfigStrategy) {
            return this.#dbConfigStrategy.getConfig();
        }
        const dbType = this.#getDBType();
        this.#dbConfigStrategy = this.#getDBStrategy(dbType);
        return this.#dbConfigStrategy.getConfig();
    };

    #getDBStrategy = (dbType) => {
        switch (dbType) {
            case DBType.MONGO:
                return new MongoDBConfig();
            case DBType.MYSQL:
                return new MySQLDBConfig();
            default:
                return new InMemoryMockDBConfig();
        }
    };

    #getDBType = () => process.env.DB_TYPE;
}

class EnvironmentConfigFactory {
    static loadConfig = (baseFilePath, environmentType) => {
        const config = new EnvironmentConfig(baseFilePath);
        config.setEnvironmentType(environmentType);
        return config.initializeConfig();
    };

    static loadDefaultConfig = () => {
        const config = new EnvironmentConfig(DEFAULT_ENV_BASE_FILE_PATH);
        return config.initializeConfig();
    };

    static loadConfigWithType = (environmentType) => {
        const config = new EnvironmentConfig(DEFAULT_ENV_BASE_FILE_PATH);
        config.setEnvironmentType(environmentType);
        return config.initializeConfig();
    };
}

const config = EnvironmentConfigFactory.loadConfigWithType(EnvironmentType.DEVELOPMENT);
export const AppConfig = config.app;
export const DBConfig = config.db;
