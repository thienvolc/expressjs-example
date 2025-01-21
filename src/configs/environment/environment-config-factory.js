import DevelopmentConfig from './development-config.js';
import TestConfig from './test-config.js';
import ProductionConfig from './production-config.js';
import { EnvironmentType } from './environment-config.js';

export default class EnvironmentConfigFactory {
    static getConfigOfType(environmentType) {
        switch (environmentType) {
            case EnvironmentType.DEVELOPMENT:
                return this.getDevelopmentConfig();
            case EnvironmentType.PRODUCTION:
                return this.getProductionConfig();
            case EnvironmentType.TEST:
                return this.getTestConfig();
            default:
                throw new Error('Environment type not found');
        }
    }

    static getDevelopmentConfig() {
        return DevelopmentConfig.getConfig();
    }

    static getProductionConfig() {
        return ProductionConfig.getConfig();
    }

    static getTestConfig() {
        return {
            ...TestConfig.getConfig(),
            environment: EnvironmentType.TEST,
        };
    }
}
