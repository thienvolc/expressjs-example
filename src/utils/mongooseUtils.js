import { Types } from 'mongoose';

export const castMongooseObjectId = (id) => new Types.ObjectId(id);
