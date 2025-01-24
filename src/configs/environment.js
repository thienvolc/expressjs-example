import { MongoDBConfig, MySQLDBConfig, InMemoryMockDBConfig, DBType } from './database.js';

export const EnvironmentType = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};

export const isValidEnvironmentType = (environmentType) => 
    Object.values(EnvironmentType).includes(environmentType);

export class EnvironmentFactory {
    static getConfig = () => ({
        host: this.getHost(),
        port: this.getPort(),
        db: this.getDB(),
    });

    static getHost = () => process.env.HOST;

    static getPort = () => process.env.PORT;

    static getDB = () => {
        const dbType = this.getDBType();
        switch (dbType) {
            case DBType.MONGO:
                return MongoDBConfig.getConfig();
            case DBType.MYSQL:
                return MySQLDBConfig.getConfig();
            default:
                return InMemoryMockDBConfig.getConfig();
        }
    };

    static getDBType = () => process.env.DB_TYPE;
}

export class DevEnvironmentFactory extends EnvironmentFactory {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.DEVELOPMENT,
    });
}

export class ProdEnvironmentFactory extends EnvironmentFactory {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.PRODUCTION,
    });
}

export class TestEnvironmentFactory extends EnvironmentFactory {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.TEST,
    });
}
