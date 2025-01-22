export default class ResponseSender {
    static send = (response, payload) => {
        response.status(payload.statusCode).json(payload);
    };
}
