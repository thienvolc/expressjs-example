import EnvironmentConfig, { EnvironmentType } from './environment-config.js';

export default class DevelopmentConfig extends EnvironmentConfig {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.DEVELOPMENT,
    });
}
