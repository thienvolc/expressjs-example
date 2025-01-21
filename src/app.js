import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(compression());
app.use(helmet());

import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error-handler.js';

app.use(routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
