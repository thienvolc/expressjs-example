import MySQLDB from './mysql.js';
import { DBConnection, DBConnectionFactory } from '../db/index.js';

export class MySQLUriHandler {
    #config;

    static getUriFromConfig = (config) => {
        const handler = new MySQLUriHandler(config);
        return handler.getUri();
    };

    constructor(config) {
        this.#config = config;
    }

    getUri = () => (this.#isSecure() ? this.#getSecureUri() : this.#getNormalUri());

    #getSecureUri = () => {};

    #getNormalUri = () => {};

    #isSecure = () => !!this.#config.user && !!this.#config.password;
}

export class MySQLConnection extends DBConnection {
    #provider;
    #config;
    #options;

    constructor() {
        super();
        this.#provider = new MySQLDB();
        this.#config = null;
        this.#options = {};
    }

    setConfig = (config) => {
        this.#config = config;
    };

    setDebug = () => {
        this.#provider.setDebug();
    };

    setSafePoolSize = () => {};

    connect = async () => {
        const connectionUri = MySQLUriHandler.getUriFromConfig(this.#config);
        const connection = await this.#provider.connect(connectionUri, this.#options);
        return connection;
    };
}

export class MySQLConnectionSingletonFactory extends DBConnectionFactory {
    static #instance = null;

    static getInstance = () => {
        if (!this.#instance) {
            this.#instance = new MySQLConnection();
        }
        return this.#instance;
    };

    static createConnection = () => this.getInstance();
}
