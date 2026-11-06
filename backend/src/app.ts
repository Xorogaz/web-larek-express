import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errors } from 'celebrate';
import { DB_ADDRESS, PORT } from './config';
import routes from './routes';
import errorHandler from './middlewares/error-handler';
import { errorLogger, logger, requestLogger } from './middlewares/logger';

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const start = async () => {
  await mongoose.connect(DB_ADDRESS);

  app.listen(PORT, () => {
    logger.info(`Сервер запущен на порту ${PORT}`);
  });
};

start().catch((error: Error) => {
  logger.error(`Не удалось запустить сервер: ${error.message}`);
  process.exit(1);
});
