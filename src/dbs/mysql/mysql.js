export default class MySQLDB {
    setConfig = (DBConfig) => {
        this.DBConfig = DBConfig;
    };

    setDebug = () => {};

    connect = async () => {};

    getUri = () => (this.isSecure() ? this.getSecureUri() : this.getNormalUri());

    getSecureUri = () => {
        const { user, password, host, port, name } = this.DBConfig;
        return `mongodb://${user}:${password}@${host}:${port}/${name}`;
    };

    getNormalUri = () => {
        const { host, port, name } = this.DBConfig;
        return `mongodb://${host}:${port}/${name}`;
    };

    isSecure = () => !!this.DBConfig.user && !!this.DBConfig.password;
}
