import { StatusCode, Message } from '../httpResponseConstants/index.js';

export class SuccessResponse {
    constructor({ statusCode, message, metadata = {}, reason }) {
        this.status = 'success';
        this.statusCode = statusCode;
        this.message = message || reason;
        this.metadata = metadata;
    }
}

export class OK extends SuccessResponse {
    constructor({ 
        statusCode = StatusCode.OK, 
        reason = Message.OK, 
        message, 
        metadata 
    }) {
        super({ message, statusCode, reason, metadata });
    }
}

export class CREATED extends SuccessResponse {
    constructor({ 
        statusCode = StatusCode.CREATED, 
        reason = Message.CREATED, 
        message,
        metadata, 
        options = {} 
    }) {
        super({ message, statusCode, reason, metadata });
        this.options = options;
    }
}
