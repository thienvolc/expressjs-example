export class ErrorResponse {
    constructor({ statusCode, message }) {
        this.status = 'error';
        this.statusCode = statusCode;
        this.message = message;
    }
}
