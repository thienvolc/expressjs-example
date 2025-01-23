export const DatabaseType = {
    MONGO: 'mongodb',
    MYSQL: 'mysql',
    MOCK: 'mock',
};

export class MongoDBDatabaseConfig {
    static getConfig = () => ({
        type: DatabaseType.MONGO,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        name: process.env.MONGO_DATABASE,
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
    });
}

export class MySQLDatabaseConfig {
    static getConfig = () => ({
        type: DatabaseType.MYSQL,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        name: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    });
}

export class InMemoryMockDatabaseConfig {
    static getConfig = () => ({
        type: DatabaseType.MOCK,
    });
}
