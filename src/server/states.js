class ServerState {
    constructor(server) {
        this.server = server;
    }

    start = () => {
        throw new Error('start() must be implemented by subclasses');
    };

    stop = () => {
        throw new Error('stop() must be implemented by subclasses');
    };

    log = (message) => {
        console.log(`[${this.constructor.name}] : ${message}`);
    };

    handleError = (error) => {
        console.error(`[${this.constructor.name}] : ${error}`);
    };
}

export class StoppedState extends ServerState {
    start = () => {
        try {
            this.server.startApp();
            this.server.transitionTo(new RunningState(this.server));
            this.log('Server has started.');
        } catch (error) {
            this.handleError(`Failed to start server: ${error}`);
        }
    };

    stop = () => {
        this.log('Server is already stopped.');
    };
}

export class RunningState extends ServerState {
    start = () => {
        this.log('Server is already running.');
    };

    stop = () => {
        try {
            this.server.stopApp();
            this.server.transitionTo(new StoppedState(this.server));
            this.log('Server has stopped.');
        } catch (error) {
            this.handleError(`Failed to stop server: ${error}`);
        }
    };
}
