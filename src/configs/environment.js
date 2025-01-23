import { MongoDBDatabaseConfig, MySQLDatabaseConfig, InMemoryMockDatabaseConfig, DatabaseType } from './database.js';

export const EnvironmentType = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};

export class EnvironmentFactory {
    static getConfig = () => ({
        host: this.getHost(),
        port: this.getPort(),
        database: this.getDatabase(),
    });

    static getHost = () => process.env.HOST;

    static getPort = () => process.env.PORT;

    static getDatabase = () => {
        const databaseType = this.getDatabaseType();
        switch (databaseType) {
            case DatabaseType.MONGO:
                return MongoDBDatabaseConfig.getConfig();
            case DatabaseType.MYSQL:
                return MySQLDatabaseConfig.getConfig();
            default:
                return InMemoryMockDatabaseConfig.getConfig();
        }
    };

    static getDatabaseType = () => process.env.DATABASE_TYPE;
}

export class DevelopmentFactory extends EnvironmentFactory {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.DEVELOPMENT,
    });
}

export class ProductionFactory extends EnvironmentFactory {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.PRODUCTION,
    });
}

export class TestFactory extends EnvironmentFactory {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.TEST,
    });
}
