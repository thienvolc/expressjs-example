import MongoDB from './index.js';
import { DBConnection, DBConnectionFactory } from '../DBConnectionFactory.js';

export class MongoUriHandler {
    #config;

    static getUriFromConfig = (config) => {
        const handler = new MongoUriHandler(config);
        return handler.getUri();
    };

    constructor(config) {
        this.#config = config;
    }

    getUri = () => (this.#isSecure() ? this.#getSecureUri() : this.#getNormalUri());

    #getSecureUri = () => {
        const { user, password, host, port, name } = this.#config;
        return `mongodb://${user}:${password}@${host}:${port}/${name}`;
    };

    #getNormalUri = () => {
        const { host, port, name } = this.#config;
        return `mongodb://${host}:${port}/${name}`;
    };

    #isSecure = () => !!this.#config.user && !!this.#config.password;
}

export class MongoConnection extends DBConnection {
    #provider;
    #config;
    #options;

    constructor() {
        super();
        this.#provider = new MongoDB();
        this.#config = null;
        this.#options = {};
    }

    setConfig = (config) => {
        this.#config = config;
    };

    setDebug = () => {
        this.#provider.setDebug();
    };

    setSafePoolSize = () => {
        this.#options = { maxPoolSize: 100 };
    };

    establishConnection = async () => {
        this.#connect();
    };

    #connect = async () => {
        const connectionUri = MongoUriHandler.getUriFromConfig(this.#config);
        const connection = await this.#provider.connect(connectionUri, this.#options);
        return connection;
    };
}

export class MongoConnectionSingletonFactory extends DBConnectionFactory {
    static #instance = null;

    static getInstance = () => {
        if (!this.#instance) {
            this.#instance = new MongoConnection();
        }
        return this.#instance;
    };

    static createConnection = () => this.getInstance();
}
