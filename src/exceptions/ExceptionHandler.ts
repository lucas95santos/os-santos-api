import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

class ExceptionHandler {
  public execute(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: 'Erro interno',
    });
  }
}

export default new ExceptionHandler();
