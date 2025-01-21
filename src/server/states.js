class ServerState {
    constructor(server) {
        this.server = server;
    }

    start() {
        throw new Error('start() must be implemented by subclasses');
    }

    stop() {
        throw new Error('stop() must be implemented by subclasses');
    }
}

export class StoppedState extends ServerState {
    start() {
        try {
            this.server.startApp();
            this.server.transitionTo(new RunningState(this.server));
            console.log('Server has started.');
        } catch (error) {
            console.error(`Error starting server: ${error}`);
        }
    }

    stop() {
        console.log('Server is already stopped.');
    }
}

export class RunningState extends ServerState {
    start() {
        console.log('Server is already running.');
    }

    stop() {
        this.server.stopApp();
        this.server.transitionTo(new StoppedState(this.server));
        console.log('Server has stopped.');
    }
}
