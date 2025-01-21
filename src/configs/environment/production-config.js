import EnvironmentConfig, { EnvironmentType } from './environment-config.js';

export default class ProductionConfig extends EnvironmentConfig {
    static getConfig() {
        return {
            ...super.getConfig(),
            environment: EnvironmentType.PRODUCTION,
        };
    }
}
