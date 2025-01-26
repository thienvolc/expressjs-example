import { AppConfig, DBConfig, DBType, isDevEnvironment } from '../config/index.js';
import { MongoConnectionSingletonFactory } from './mongo/connection.js';
// import { MySQLConnectionSingletonFactory } from './mysql/connection.js';

class ProxyDBConnection {
    #dbConnection;
    #appConfig;
    #dbConfig;

    constructor(appConfig, dbConfig) {
        this.#dbConnection = null;
        this.#appConfig = appConfig;
        this.#dbConfig = dbConfig;
    }

    establishConnection = async () => {
        this.#initializeDBConnection();
        this.#configureForEnvironment();
        await this.#dbConnection.establishConnection();
        return this;
    };

    #initializeDBConnection = () => {
        this.#createDBConnection();
        this.#setDBConnectionConfig();
    };

    #createDBConnection = () => {
        const dbType = this.#dbConfig.type;
        switch (dbType) {
            case DBType.MONGO:
                this.#dbConnection = MongoConnectionSingletonFactory.createConnection();
                break;
            default:
                throw new Error('Database not supported');
        }
    };

    #setDBConnectionConfig = () => {
        this.#dbConnection.setConfig(this.#dbConfig);
    };

    #configureForEnvironment = () => {
        const environment = this.#appConfig.environment;
        if (isDevEnvironment(environment)) {
            this.#enableDevelopmentMode();
        }
    };

    #enableDevelopmentMode = () => {
        this.#dbConnection.setDebug();
        this.#dbConnection.setSafePoolSize();
    };
}

export default new ProxyDBConnection(AppConfig, DBConfig);
