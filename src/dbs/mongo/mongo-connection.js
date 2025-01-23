import { DBConnection, DBConnectionFactory } from '../db/index.js';
import MongoDB from './mongo.js';
import { environmentConfig, EnvironmentType } from '../../configs/index.js';

export class MongoConnection extends DBConnection {
    constructor() {
        super();
        this.provider = new MongoDB();
        this.environmentConfig = environmentConfig;
    }

    establishConnection = async () => {
        this.setConfigForProvider();
        const connection = await this.provider.connect();
        this.logDevelopment();
        return connection;
    };

    setConfigForProvider = () => {
        this.provider.setConfig(this.environmentConfig.database);
        this.setDebugIfNotProduction();
    };

    setDebugIfNotProduction = () => {
        if (!this.isProductionEnvironment()) {
            this.provider.setDebug();
        }
    };

    isProductionEnvironment = () => this.environmentConfig.environment === EnvironmentType.PRODUCTION;

    logDevelopment = () => {
        if (this.isDevelopmentEnvironment()) {
            console.log('Mongo connection established');
        }
    };

    isDevelopmentEnvironment = () => this.environmentConfig.environment === EnvironmentType.DEVELOPMENT;
}

export class MongoConnectionFactory extends DBConnectionFactory {
    static #mongoInstance;

    static getInstance = () => {
        if (!this.#mongoInstance) {
            const connection = new MongoConnection();
            this.#mongoInstance = connection.establishConnection();
        }
        return this.#mongoInstance;
    };

    static createConnection = () => this.getInstance();
}
