import mongoose from 'mongoose';

export default class MongoDB {
    setConfig = (DBConfig) => {
        this.DBConfig = DBConfig;
    };

    setDebug = () => {
        mongoose.set('debug', true);
        mongoose.set('debug', { color: true });
    };

    connect = async () => {
        const connectUri = this.getUri();
        const options = { maxPoolSize: 100 };
        try {
            return await mongoose.connect(connectUri, options);
        } catch (error) {
            throw new Error(`Error connecting to MongoDB: ${error}`);
        }
    };

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
