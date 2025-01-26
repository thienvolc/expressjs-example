import { EnvironmentConfig, EnvironmentType } from './EnvironmentConfig.js';

const DEFAULT_ENV_BASE_FILE_PATH = './.env';

class EnvironmentConfigFactory {
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
}

const config = EnvironmentConfigFactory.loadConfigWithType(EnvironmentType.DEVELOPMENT);
export const AppConfig = config.app;
export const DBConfig = config.db;
