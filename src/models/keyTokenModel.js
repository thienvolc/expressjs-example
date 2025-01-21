import { model, Schema } from 'mongoose';

const COLLECTION_NAME = 'keyTokens';
const DOCUMNET_NAME = 'KeyToken';

const keyTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        usedRefreshTokens: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

export default model(DOCUMNET_NAME, keyTokenSchema);
