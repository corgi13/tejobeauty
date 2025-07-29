// middleware/requestValidator.ts - Middleware za validaciju zahtjeva
import { Request, Response, NextFunction } from "express";

import { ValidationError } from "../utils/errorTypes";

/**
 * Tip za shemu validacije
 */
type ValidationSchema = {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object" | "array";
    required?: boolean;
    min?: number;
    max?: number;
    enum?: any[];
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
};

/**
 * Factory funkcija koja stvara middleware za validaciju
 * @param schema Shema za validaciju
 * @param location Lokacija parametara ('body', 'query', 'params')
 */
export const validateRequest = (
  schema: ValidationSchema,
  location: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[location];
    const errors: Record<string, string> = {};

    // Provjeri svako polje prema shemi
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      // middleware/requestValidator.ts - Middleware za validaciju zahtjeva
      import { Request, Response, NextFunction } from "express";

      import { ValidationError } from "../utils/errorTypes";

      /**
       * Tip za shemu validacije
       */
      type ValidationSchema = {
        [key: string]: {
          type: "string" | "number" | "boolean" | "object" | "array";
          required?: boolean;
          min?: number;
          max?: number;
          enum?: any[];
          pattern?: RegExp;
          custom?: (value: any) => boolean | string;
        };
      };

      /**
       * Factory funkcija koja stvara middleware za validaciju
       * @param schema Shema za validaciju
       * @param location Lokacija parametara ('body', 'query', 'params')
       */
      export const validateRequest = (
        schema: ValidationSchema,
        location: "body" | "query" | "params" = "body",
      ) => {
        return (req: Request, res: Response, next: NextFunction) => {
          const data = req[location];
          const errors: Record<string, string> = {};

          // Provjeri svako polje prema shemi
          for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];

            // Provjeri je li polje obavezno
            if (
              rules.required &&
              (value === undefined || value === null || value === "")
            ) {
              errors[field] = `Polje ${field} je obavezno`;
              continue;
            }

            // Ako polje nije prisutno i nije obavezno, preskoči ostale provjere
            if (value === undefined || value === null) continue;

            // Provjeri tip
            const actualType = Array.isArray(value) ? "array" : typeof value;
            if (
              actualType !== rules.type &&
              !(rules.type === "array" && Array.isArray(value))
            ) {
              errors[field] = `Polje ${field} mora biti tipa ${rules.type}`;
              continue;
            }

            // Provjeri minimalnu duljinu/vrijednost
            if (rules.min !== undefined) {
              if (
                (typeof value === "string" && value.length < rules.min) ||
                (typeof value === "number" && value < rules.min) ||
                (Array.isArray(value) && value.length < rules.min)
              ) {
                errors[field] =
                  `Polje ${field} mora imati minimalno ${rules.min} ${typeof value === "number" ? "" : "znakova"}`;
              }
            }

            // Provjeri maksimalnu duljinu/vrijednost
            if (rules.max !== undefined) {
              if (
                (typeof value === "string" && value.length > rules.max) ||
                (typeof value === "number" && value > rules.max) ||
                (Array.isArray(value) && value.length > rules.max)
              ) {
                errors[field] =
                  `Polje ${field} može imati maksimalno ${rules.max} ${typeof value === "number" ? "" : "znakova"}`;
              }
            }

            // Provjeri enum vrijednosti
            if (rules.enum && !rules.enum.includes(value)) {
              errors[field] =
                `Polje ${field} mora biti jedna od sljedećih vrijednosti: ${rules.enum.join(", ")}`;
            }

            // Provjeri regex pattern
            if (
              rules.pattern &&
              typeof value === "string" &&
              !rules.pattern.test(value)
            ) {
              errors[field] = `Polje ${field} nije u ispravnom formatu`;
            }

            // Provjeri prilagođenu validaciju
            if (rules.custom) {
              const customResult = rules.custom(value);
              if (customResult !== true) {
                errors[field] =
                  typeof customResult === "string"
                    ? customResult
                    : `Polje ${field} nije valjano`;
              }
            }
          }

          // Ako ima grešaka, vrati ValidationError
          if (Object.keys(errors).length > 0) {
            return next(
              new ValidationError("Greška validacije podataka", errors),
            );
          }

          // Ako nema grešaka, nastavi dalje
          next();
        };
      };

      export default validateRequest;
      // Provjeri je li polje obavezno
      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors[field] = `Polje ${field} je obavezno`;
        continue;
      }

      // Ako polje nije prisutno i nije obavezno, preskoči ostale provjere
      if (value === undefined || value === null) continue;

      // Provjeri tip
      const actualType = Array.isArray(value) ? "array" : typeof value;
      if (
        actualType !== rules.type &&
        !(rules.type === "array" && Array.isArray(value))
      ) {
        errors[field] = `Polje ${field} mora biti tipa ${rules.type}`;
        continue;
      }

      // Provjeri minimalnu duljinu/vrijednost
      if (rules.min !== undefined) {
        if (
          (typeof value === "string" && value.length < rules.min) ||
          (typeof value === "number" && value < rules.min) ||
          (Array.isArray(value) && value.length < rules.min)
        ) {
          errors[field] =
            `Polje ${field} mora imati minimalno ${rules.min} ${typeof value === "number" ? "" : "znakova"}`;
        }
      }

      // Provjeri maksimalnu duljinu/vrijednost
      if (rules.max !== undefined) {
        if (
          (typeof value === "string" && value.length > rules.max) ||
          (typeof value === "number" && value > rules.max) ||
          (Array.isArray(value) && value.length > rules.max)
        ) {
          errors[field] =
            `Polje ${field} može imati maksimalno ${rules.max} ${typeof value === "number" ? "" : "znakova"}`;
        }
      }

      // Provjeri enum vrijednosti
      if (rules.enum && !rules.enum.includes(value)) {
        errors[field] =
          `Polje ${field} mora biti jedna od sljedećih vrijednosti: ${rules.enum.join(", ")}`;
      }

      // Provjeri regex pattern
      if (
        rules.pattern &&
        typeof value === "string" &&
        !rules.pattern.test(value)
      ) {
        errors[field] = `Polje ${field} nije u ispravnom formatu`;
      }

      // Provjeri prilagođenu validaciju
      if (rules.custom) {
        const customResult = rules.custom(value);
        if (customResult !== true) {
          errors[field] =
            typeof customResult === "string"
              ? customResult
              : `Polje ${field} nije valjano`;
        }
      }
    }

    // Ako ima grešaka, vrati ValidationError
    if (Object.keys(errors).length > 0) {
      return next(new ValidationError("Greška validacije podataka", errors));
    }

    // Ako nema grešaka, nastavi dalje
    next();
  };
};

export default validateRequest;
