import dotenv from 'dotenv';
import { DevEnvironmentFactory, ProdEnvironmentFactory } from './environment.js';
import { TestEnvironmentFactory, EnvironmentType, isValidEnvironmentType } from './environment.js';

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

    constructor(baseFilePath) {
        this.#baseFilePath = baseFilePath;
        this.#environmentType = null;
    }

    setEnvironmentType = (environmentType) => {
        if (!isValidEnvironmentType(environmentType)) {
            throw new Error('Environment type is not valid!');
        }
        this.#environmentType = environmentType;
    };

    initializeConfig = () => {
        this.#loadEnvironmentFile();
        return this.#getConfig();
    };

    #loadEnvironmentFile = () => {
        const filePath = EnvironmentFilePathHandler.getFilePath(this.#baseFilePath, this.#environmentType);
        new EnvironmentConfigLoader(filePath).load();
    };

    #getConfig() {
        switch (this.#environmentType) {
            case EnvironmentType.DEVELOPMENT:
                return DevEnvironmentFactory.getConfig();
            case EnvironmentType.PRODUCTION:
                return ProdEnvironmentFactory.getConfig();
            case EnvironmentType.TEST:
                return TestEnvironmentFactory.getConfig();
            default:
                throw new Error('Invalid environment type!');
        }
    }
}

export default EnvironmentConfig.loadConfigWithType(EnvironmentType.DEVELOPMENT);
