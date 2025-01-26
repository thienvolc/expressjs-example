import { StatusCode, ResponseMessage } from '../http/index.js';

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
        reason = ResponseMessage.OK, 
        message, 
        metadata 
    }) {
        super({ message, statusCode, reason, metadata });
    }
}

export class CREATED extends SuccessResponse {
    constructor({ 
        statusCode = StatusCode.CREATED, 
        reason = ResponseMessage.CREATED, 
        message,
        metadata, 
        options = {} 
    }) {
        super({ message, statusCode, reason, metadata });
        this.options = options;
    }
}
