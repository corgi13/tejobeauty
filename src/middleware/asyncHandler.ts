// middleware/asyncHandler.ts - Utility za rukovanje asinkronim rutama
import { Request, Response, NextFunction } from "express";
// middleware/asyncHandler.ts - Utility za rukovanje asinkronim rutama
import { Request, Response, NextFunction } from "express";

/**
 * Wrapper funkcija koja hvata greške u asinkronim Express rutama
 * i prosljeđuje ih error handleru
 */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
/**
 * Wrapper funkcija koja hvata greške u asinkronim Express rutama
 * i prosljeđuje ih error handleru
 */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
