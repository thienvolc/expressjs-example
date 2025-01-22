export const DatabaseType = {
    MONGO: 'mongodb',
    MYSQL: 'mysql',
    MOCK: 'mock',
};

export const EnvironmentType = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};

export default class EnvironmentConfig {
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
                return this.getMongoDBDatabase();
            case DatabaseType.MYSQL:
                return this.getMySQLDatabase();
            default:
                return this.getMockDatabase();
        }
    };

    static getDatabaseType = () => process.env.DATABASE_TYPE;

    static getMongoDBDatabase = () => ({
        type: DatabaseType.MONGO,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        name: process.env.MONGO_DATABASE,
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
    });

    static getMySQLDatabase = () => ({
        type: DatabaseType.MYSQL,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        name: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    });

    static getMockDatabase = () => ({
        type: DatabaseType.MOCK,
    });
}
