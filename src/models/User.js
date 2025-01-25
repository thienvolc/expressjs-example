import { model, Schema } from 'mongoose';

const COLLECTION_NAME = 'users';
const DOCUMNET_NAME = 'User';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        verify: {
            type: String,
            required: true,
            enum: ['verified', 'unverified'],
            default: 'unverified',
        },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

export default model(DOCUMNET_NAME, userSchema);
