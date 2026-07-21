import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, ZodRawShape } from "zod";

export const validate =
  <T extends ZodRawShape>(schema: ZodObject<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if ("body" in parsed && (parsed as any).body) {
        req.body = (parsed as any).body;
      }

      if ("query" in parsed && (parsed as any).query) {
        const queryData = (parsed as any).query;
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, queryData);
      }

      if ("params" in parsed && (parsed as any).params) {
        const paramsData = (parsed as any).params;
        Object.keys(req.params).forEach((key) => delete req.params[key]);
        Object.assign(req.params, paramsData);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  };