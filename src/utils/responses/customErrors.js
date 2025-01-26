import { StatusCode, ResponseMessage } from '../http/index.js';

class ResponseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ConflictRequestError extends ResponseError {
    constructor(message = ResponseMessage.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

export class InternalServerError extends ResponseError {
    constructor(message = ResponseMessage.INTERNAL_SERVER_ERROR, statusCode = StatusCode.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}

export class BadRequestError extends ResponseError {
    constructor(message = ResponseMessage.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}

export class AuthFailureError extends ResponseError {
    constructor(message = ResponseMessage.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

export class NotFoundError extends ResponseError {
    constructor(message = ResponseMessage.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode);
    }
}

export class ForbiddenError extends ResponseError {
    constructor(message = ResponseMessage.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}
