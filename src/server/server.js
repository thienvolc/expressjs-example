import process from 'process';
import { StoppedState } from './states.js';

export default class Server {
    constructor(config) {
        this.app = config.app;
        this.port = config.port;
        this.host = config.host;
        this.instance = null;
        this.state = new StoppedState(this);
    }

    static createByConfig = (config) => new Server(config);

    transitionTo = (newState) => {
        this.state = newState;
    };

    start = () => {
        this.state.start();
    };

    stop = () => {
        this.state.stop();
    };

    startApp = () => {
        this.instance = this.app.listen(this.port, this.host, () => {
            console.log(`Server running on http://${this.host}:${this.port}`);
        });

        this.addSignalListeners();
    };

    addSignalListeners = () => {
        process.on('SIGINT', () => this.stopApp());
        process.on('SIGTERM', () => this.stopApp());
    };

    stopApp = () => {
        if (this.instance) {
            this.instance.close(() => {
                console.log('Server instance closed.');
                process.exit(0);
            });
        }
    };
}
