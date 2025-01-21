import EnvironmentConfig, { EnvironmentType } from './environment-config.js';

export default class DevelopmentConfig extends EnvironmentConfig {
    static getConfig() {
        return {
            ...super.getConfig(),
            environment: EnvironmentType.DEVELOPMENT,
        };
    }
}
