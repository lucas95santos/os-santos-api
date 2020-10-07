import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
// config
import authConfig from '../config/auth';
// error
import AppError from '../exceptions/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('O token JWT não está presente', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as TokenPayload;

    request.requestUser = {
      id: sub,
    };

    next();
  } catch (error) {
    throw new AppError('Token JWT inválido', 401);
  }
}
