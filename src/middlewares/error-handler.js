import { ErrorResponse, ResponseSender, NotFoundError } from '../utils/responses/index.js';
import { Message, StatusCode } from '../utils/httpResponseConstants/index.js';

export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || Message.INTERNAL_SERVER_ERROR;
    const errorResponse = new ErrorResponse({ statusCode, message });
    ResponseSender.send(res, errorResponse);
};

export const notFoundHandler = (req, res, next) => {
    throw new NotFoundError();
};
