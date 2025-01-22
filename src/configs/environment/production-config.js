import EnvironmentConfig, { EnvironmentType } from './environment-config.js';

export default class ProductionConfig extends EnvironmentConfig {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.PRODUCTION,
    });
}
