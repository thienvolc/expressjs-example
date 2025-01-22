import EnvironmentConfig, { EnvironmentType } from './environment-config.js';

export default class TestConfig extends EnvironmentConfig {
    static getConfig = () => ({
        ...super.getConfig(),
        environment: EnvironmentType.TEST,
    });
}
