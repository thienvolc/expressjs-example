import 'dotenv/config';
import dotenv from 'dotenv';

const ENVIRONMENT_PATH = './.env';

class ConfigLoader {
    static getEnvironmentType() {
        return process.env.NODE_ENV;
    }

    static loadEnvironmentFileByType(environmentType) {
        const basePath = ENVIRONMENT_PATH;
        const filePath = `${basePath}.${environmentType}`;
        dotenv.config({ path: filePath });
    }
}

import EnvironmentConfigFactory from './environment/environment-config-factory.js';

class AppConfig {
    static loadAndGetEnvironmentConfig() {
        const environmentType = ConfigLoader.getEnvironmentType();
        ConfigLoader.loadEnvironmentFileByType(environmentType);
        return EnvironmentConfigFactory.getConfigOfType(environmentType);
    }
}

const config = AppConfig.loadAndGetEnvironmentConfig();

export default config;
