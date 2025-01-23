import { DBConnection, DBConnectionFactory } from '../db/index.js';
import { environmentConfig, EnvironmentType } from '../../configs/index.js';
import MySQLDB from './mysql.js';

export class MySQLConnection extends DBConnection {
    constructor() {
        super();
        this.provider = new MySQLDB();
        this.environmentConfig = environmentConfig;
    }

    establishConnection = async () => {
        this.setConfigForProvider();
        const connection = await this.provider.connect();
        this.logDevelopment();
        return connection;
    };

    setConfigForProvider = () => {
        this.provider.setConfig(this.environmentConfig.db);
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
            console.log('MySQL connection established');
        }
    };

    isDevelopmentEnvironment = () => this.environmentConfig.environment === EnvironmentType.DEVELOPMENT;
}

export class MySQLConnectionFactory extends DBConnectionFactory {
    static #MySQLInstance;

    static getInstance = () => {
        if (!this.#MySQLInstance) {
            const connection = new MySQLConnection();
            this.#MySQLInstance = connection.establishConnection();
        }
        return this.#MySQLInstance;
    };

    static createConnection = () => this.getInstance();
}
