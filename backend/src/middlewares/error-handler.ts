import { NextFunction, Request, Response } from 'express';

const INTERNAL_SERVER_ERROR = 500;

interface HttpError extends Error {
  statusCode?: number;
}

const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode ?? INTERNAL_SERVER_ERROR;

  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message,
  });
};

export default errorHandler;
