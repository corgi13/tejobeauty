// utils/ApiResponse.ts - Standardizacija API odgovora
import { Response } from "express";
// utils/ApiResponse.ts - Standardizacija API odgovora
import { Response } from "express";

/**
 * Klasa za standardizaciju API odgovora
 */
export class ApiResponse {
  /**
   * Uspješan odgovor
   */
  static success(
    res: Response,
    data: any = {},
    message: string = "Uspješno",
    statusCode: number = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Kreiran resurs
   */
  static created(
    res: Response,
    data: any = {},
    message: string = "Resurs je uspješno kreiran",
  ) {
    return this.success(res, data, message, 201);
  }

  /**
   * Odgovor bez sadržaja
   */
  static noContent(res: Response) {
    return res.status(204).end();
  }

  /**
   * Greška klijenta
   */
  static error(
    res: Response,
    message: string = "Greška zahtjeva",
    statusCode: number = 400,
    errors: any = null,
  ) {
    const response: any = {
      success: false,
      message,
      statusCode,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Neautoriziran pristup
   */
  static unauthorized(
    res: Response,
    message: string = "Neautoriziran pristup",
  ) {
    return this.error(res, message, 401);
  }

  /**
   * Zabranjen pristup
   */
  static forbidden(res: Response, message: string = "Pristup zabranjen") {
    return this.error(res, message, 403);
  }

  /**
   * Resurs nije pronađen
   */
  static notFound(res: Response, message: string = "Resurs nije pronađen") {
    return this.error(res, message, 404);
  }

  /**
   * Interna greška servera
   */
  static serverError(
    res: Response,
    message: string = "Interna greška servera",
  ) {
    return this.error(res, message, 500);
  }

  /**
   * Paginacija rezultata
   */
  static paginated(
    res: Response,
    {
      data,
      page,
      limit,
      total,
      message = "Uspješno",
    }: {
      data: any[];
      page: number;
      limit: number;
      total: number;
      message?: string;
    },
  ) {
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}

export default ApiResponse;
/**
 * Klasa za standardizaciju API odgovora
 */
export class ApiResponse {
  /**
   * Uspješan odgovor
   */
  static success(
    res: Response,
    data: any = {},
    message: string = "Uspješno",
    statusCode: number = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Kreiran resurs
   */
  static created(
    res: Response,
    data: any = {},
    message: string = "Resurs je uspješno kreiran",
  ) {
    return this.success(res, data, message, 201);
  }

  /**
   * Odgovor bez sadržaja
   */
  static noContent(res: Response) {
    return res.status(204).end();
  }

  /**
   * Greška klijenta
   */
  static error(
    res: Response,
    message: string = "Greška zahtjeva",
    statusCode: number = 400,
    errors: any = null,
  ) {
    const response: any = {
      success: false,
      message,
      statusCode,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Neautoriziran pristup
   */
  static unauthorized(
    res: Response,
    message: string = "Neautoriziran pristup",
  ) {
    return this.error(res, message, 401);
  }

  /**
   * Zabranjen pristup
   */
  static forbidden(res: Response, message: string = "Pristup zabranjen") {
    return this.error(res, message, 403);
  }

  /**
   * Resurs nije pronađen
   */
  static notFound(res: Response, message: string = "Resurs nije pronađen") {
    return this.error(res, message, 404);
  }

  /**
   * Interna greška servera
   */
  static serverError(
    res: Response,
    message: string = "Interna greška servera",
  ) {
    return this.error(res, message, 500);
  }

  /**
   * Paginacija rezultata
   */
  static paginated(
    res: Response,
    {
      data,
      page,
      limit,
      total,
      message = "Uspješno",
    }: {
      data: any[];
      page: number;
      limit: number;
      total: number;
      message?: string;
    },
  ) {
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}

export default ApiResponse;
