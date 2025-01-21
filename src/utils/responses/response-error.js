import { StatusCode, Message } from '../httpResponseConstants/index.js';

export class ErrorResponse {
    constructor({ statusCode, message }) {
        this.status = 'error';
        this.statusCode = statusCode;
        this.message = message;
    }
}

class ResponseError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ConflictRequestError extends ResponseError {
    constructor(message = Message.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

export class InternalServerError extends ResponseError {
    constructor(message = Message.INTERNAL_SERVER_ERROR, statusCode = StatusCode.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}

export class BadRequestError extends ResponseError {
    constructor(message = Message.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}

export class AuthFailureError extends ResponseError {
    constructor(message = Message.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

export class NotFoundError extends ResponseError {
    constructor(message = Message.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode);
    }
}

export class ForbiddenError extends ResponseError {
    constructor(message = Message.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}
