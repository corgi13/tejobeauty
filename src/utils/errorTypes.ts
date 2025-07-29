// utils/errorTypes.ts - Tipovi za bolje upravljanje greškama
// utils/errorTypes.ts - Tipovi za bolje upravljanje greškama
// errorTypes.ts - Definicije tipova grešaka

/**
 * Osnovna klasa za aplikacijske greške
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Zbog načina na koji nasljeđivanje funkcionira u ES klasama
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Greška validacije (400 Bad Request)
 */
export class ValidationError extends AppError {
  errors: Record<string, any>;

  constructor(message: string, errors: Record<string, any> = {}) {
    super(message, 400);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Greška autentikacije (401 Unauthorized)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Neuspješna autentikacija") {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Greška autorizacije (403 Forbidden)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Pristup zabranjen") {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Greška kad resurs nije pronađen (404 Not Found)
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resurs nije pronađen") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Greška kad se dogodi konflikt (409 Conflict)
 */
export class ConflictError extends AppError {
  constructor(message: string = "Sukob zahtjeva") {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Greška vanjskog servisa (502 Bad Gateway)
 */
export class ServiceError extends AppError {
  service: string;

  constructor(message: string, service: string) {
    super(message, 502);
    this.service = service;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}
/**
 * Base class za sve aplikacijske greške
 * Ova klasa proširuje standardni Error objekt i dodaje statusCode i isOperational svojstva
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Ova linija je potrebna kako bi Error.captureStackTrace ispravno radio
    Error.captureStackTrace(this, this.constructor);

    // Postavi ime klase u stack trace (korisno za debagiranje)
    this.name = this.constructor.name;
  }
}

/**
 * Greška validacije - koristi se za greške validacije podataka
 */
export class ValidationError extends AppError {
  errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string> = {}) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Greška autentifikacije - koristi se za pogrešne kredencijale
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Pogrešni podaci za prijavu") {
    super(message, 401);
  }
}

/**
 * Greška autorizacije - koristi se kada korisnik nema dozvolu za pristup resursu
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Nemate dozvolu za pristup ovom resursu") {
    super(message, 403);
  }
}

/**
 * Greška resursa koji nije pronađen
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resurs") {
    super(`${resource} nije pronađen`, 404);
  }
}

/**
 * Greška konflikta - koristi se kada dolazi do konflikta sa trenutnim stanjem resursa
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Greška baze podataka - koristi se za greške povezane s bazom podataka
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Greška pri radu s bazom podataka") {
    super(message, 500);
  }
}

/**
 * Greška vanjskog servisa - koristi se za greške pri komunikaciji s vanjskim servisima
 */
export class ExternalServiceError extends AppError {
  service: string;

  constructor(service: string, message: string) {
    super(`Greška vanjskog servisa (${service}): ${message}`, 502);
    this.service = service;
  }
}
/**
 * Base class za sve aplikacijske greške
 * Ova klasa proširuje standardni Error objekt i dodaje statusCode i isOperational svojstva
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Ova linija je potrebna kako bi Error.captureStackTrace ispravno radio
    Error.captureStackTrace(this, this.constructor);

    // Postavi ime klase u stack trace (korisno za debagiranje)
    this.name = this.constructor.name;
  }
}

/**
 * Greška validacije - koristi se za greške validacije podataka
 */
export class ValidationError extends AppError {
  errors: Record<string, string>;

  constructor(message: string, errors: Record<string, string> = {}) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Greška autentifikacije - koristi se za pogrešne kredencijale
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Pogrešni podaci za prijavu") {
    super(message, 401);
  }
}

/**
 * Greška autorizacije - koristi se kada korisnik nema dozvolu za pristup resursu
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Nemate dozvolu za pristup ovom resursu") {
    super(message, 403);
  }
}

/**
 * Greška resursa koji nije pronađen
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resurs") {
    super(`${resource} nije pronađen`, 404);
  }
}

/**
 * Greška konflikta - koristi se kada dolazi do konflikta sa trenutnim stanjem resursa
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Greška baze podataka - koristi se za greške povezane s bazom podataka
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Greška pri radu s bazom podataka") {
    super(message, 500);
  }
}

/**
 * Greška vanjskog servisa - koristi se za greške pri komunikaciji s vanjskim servisima
 */
export class ExternalServiceError extends AppError {
  service: string;

  constructor(service: string, message: string) {
    super(`Greška vanjskog servisa (${service}): ${message}`, 502);
    this.service = service;
  }
}
