import 'dotenv/config';
import dotenv from 'dotenv';

const ENVIRONMENT_PATH = './.env';

class ConfigLoader {
    static getEnvironmentType = () => process.env.NODE_ENV;

    static loadEnvironmentFileByType = (environmentType) => {
        const filePath = `${ENVIRONMENT_PATH}.${environmentType}`;
        dotenv.config({ path: filePath });
    };
}

import { DevEnvironmentFactory, ProdEnvironmentFactory } from './environment.js';
import { TestEnvironmentFactory, EnvironmentType } from './environment.js';

class AppConfig {
    static loadAndGetEnvironmentConfig = () => {
        const environmentType = ConfigLoader.getEnvironmentType();
        ConfigLoader.loadEnvironmentFileByType(environmentType);
        return this.getEnvironmentConfigByType(environmentType);
    };

    static getEnvironmentConfigByType(environmentType) {
        switch (environmentType) {
            case EnvironmentType.DEVELOPMENT:
                return DevEnvironmentFactory.getConfig();
            case EnvironmentType.PRODUCTION:
                return ProdEnvironmentFactory.getConfig();
            case EnvironmentType.TEST:
                return TestEnvironmentFactory.getConfig();
            default:
                throw new Error('Environment type is not valid!');
        }
    }
}

const environmentConfig = AppConfig.loadAndGetEnvironmentConfig();

export default environmentConfig;
