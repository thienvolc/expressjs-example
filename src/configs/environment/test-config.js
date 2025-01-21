import EnvironmentConfig, { EnvironmentType } from './environment-config.js';

export default class TestConfig extends EnvironmentConfig {
    static getConfig() {
        return {
            ...super.getConfig(),
            environment: EnvironmentType.TEST,
        };
    }
}
