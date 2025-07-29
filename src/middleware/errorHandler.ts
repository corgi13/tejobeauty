
// middleware/errorHandler.ts - Middleware za centralizirano rukovanje greškama
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorTypes';
import logger from '../utils/logger';

// Precizniji tip za detalje greške
type ErrorDetails = {
  errors?: unknown;
  service?: string;
  duplicateKey?: unknown;
  param?: string;
  value?: unknown;
};

/**
 * Globalni error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction // next nije potreban, ali ga Express zahtijeva
) => {
  // Default vrijednosti
  let statusCode = 500;
  let message = 'Interna greška servera';
  let errorDetails: ErrorDetails = {};

  // Provjeri je li greška instanca AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    // Dodaj dodatne detalje ako postoje
    if ('errors' in err) {
      errorDetails.errors = (err as AppError & { errors?: unknown }).errors;
    }
    if ('service' in err) {
      errorDetails.service = (err as AppError & { service?: string }).service;
    }
  }

  // Posebno rukovanje za MongoDB greške
  if (err.name === 'MongoServerError' || err.name === 'MongoError') {
    statusCode = 500;
    message = 'Greška baze podataka';

    // Duplicate key error
    if ((err as { code?: number; keyValue?: unknown }).code === 11000) {
      statusCode = 409;
      message = 'Resurs s ovim podacima već postoji';
      errorDetails.duplicateKey = (err as { keyValue?: unknown }).keyValue;
    }
  }

  // Validation error (Mongoose)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Greška validacije';
    errorDetails.errors = (err as { errors?: unknown }).errors;
  }

  // CastError (Mongoose) - obično kada je ID format neispravan
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Neispravan format parametra';
    errorDetails.param = (err as { path?: string }).path;
    errorDetails.value = (err as { value?: unknown }).value;
  }

  // SyntaxError - obično kada je JSON neispravan
  if (err.name === 'SyntaxError') {
    statusCode = 400;
    message = 'Neispravan format zahtjeva';
  }

  // Log error
  const logMeta = {
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    ...errorDetails
  };

  if (statusCode >= 500) {
    logger.error(message, { ...logMeta, stack: err.stack });
  } else {
    logger.warn(message, logMeta);
  }

  // Formatiraj odgovor
  const errorResponse: {
    error: string;
    statusCode: number;
    details?: ErrorDetails;
    stack?: string;
  } = {
    error: message,
    statusCode
  };

  // Dodaj detalje u development modu ili ako su operacionalne greške
  if (process.env.NODE_ENV === 'development' || (err instanceof AppError && err.isOperational)) {
    if (Object.keys(errorDetails).length > 0) {
      errorResponse.details = errorDetails;
    }

    // U development modu, uključi stack trace
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = err.stack;
    }
  }

  // Pošalji odgovor
  res.status(statusCode).json(errorResponse);
};

/**
 * Pomoćna funkcija za izbjegavanje try/catch blokova u route handlerima
 */
// Tipizirani async handler za Express route funkcije
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}