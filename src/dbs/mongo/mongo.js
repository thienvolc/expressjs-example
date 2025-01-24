import mongoose from 'mongoose';

export default class MongoDB {
    setDebug = () => {
        mongoose.set('debug', true);
        mongoose.set('debug', { color: true });
    };

    connect = async (connectionUri, options) => {
        try {
            return await mongoose.connect(connectionUri, options);
        } catch (error) {
            throw new Error(`Error connecting to MongoDB: ${error}`);
        }
    };
}
