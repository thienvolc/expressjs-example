import process from 'process';
import { StoppedState } from './states.js';

export default class Server {
    #app;
    #config;
    #instance;
    #state;

    static create = (app, config) => new Server(app, config);

    constructor(app, config) {
        this.#app = app;
        this.#config = config;
        this.#instance = null;
        this.#state = new StoppedState(this);
    }

    transitionTo = (newState) => {
        this.#state = newState;
    };

    start = () => {
        this.#state.start();
    };

    stop = () => {
        this.#state.stop();
    };

    #initializeServer = () => {
        const { host, port } = this.#config;
        this.#instance = this.#app.listen(port, host, () => {
            console.log(`Server running on http://${host}:${port}`);
        });
        this.#addSignalListeners();
    };

    #addSignalListeners = () => {
        process.on('SIGINT', () => this.stopApp());
        process.on('SIGTERM', () => this.stopApp());
    };

    #terminateServer = () => {
        if (this.#instance) {
            this.#instance.close(() => {
                console.log('Server instance closed.');
                process.exit(0);
            });
        }
    };

    startApp = this.#initializeServer;
    stopApp = this.#terminateServer;
}
