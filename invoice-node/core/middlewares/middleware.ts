import { BadRequestError, RequestError, ServerError, ValidationError } from "@server/errors";
import { chirp, } from "@server/utilities";
import { NextFunction, Request as ExpressRequest, RequestHandler, Response as ExpressResponse } from "express";
import { validationResult } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import { QueryExtras, QueryOptions } from "./query_parser";

export type Request = ExpressRequest & {
  attr?: { [index: string]: any };
  extras?: QueryExtras;
  files?: any;

  parse_query?: () => QueryOptions,
};

export type Response = ExpressResponse & {
  result?: any;
  meta?: any;
  repath?: string;
  file?: File;
  filestream?: StreamResult;
};
export type RequestBody = ExpressRequest["body"];

export type PageResponse = ExpressResponse & {
  page_data: any;
};

export type StreamResult = {
  stream: NodeJS.ReadableStream;
  filename?: string;
  content_type?: string;
  content_length?: number;
};

export class MiddlewareError extends ServerError { };
export type MiddleHandler<T extends Request = Request, S extends Response = Response> = (req: T, res: S) => Promise<void> | void;
export type ResponseError = {
  type: string;
  message: string;
  code: number;
  errors?: any;
};

export const middleware_error_handler = (req: Request, res: Response, next: NextFunction) => {
  return (thrownError: Error & { code: any }) => {
    chirp("error handler", thrownError.constructor?.name);

    if (!thrownError.constructor) {
      return res.status(500).send(thrownError);
    }

    if (thrownError.constructor !== BadRequestError) {
      chirp("server error", thrownError.stack);
    }

    const error: ResponseError = {
      type: thrownError.constructor.name,
      message: thrownError.message,
      code: thrownError.code,
    };

    if ((<any>thrownError).extras) {
      error.errors = (<RequestError>thrownError).extras;
    } else if (thrownError instanceof ServerError) {
      error.code = 500;
    } else if (thrownError instanceof UniqueConstraintError) {
      error.errors = thrownError.errors;
    }

    res.status(error.code || 500).send({ error });
  }
};

export const make = (serve: MiddleHandler): RequestHandler => {
  if (typeof serve !== "function")
    throw new MiddlewareError("invalid serve function");

  return (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const result = serve(req, res);
    return Promise.resolve(result)
      .then(() => next())
      .catch(middleware_error_handler(req, res, next));
  };
};

export const validate = () => {
  return make(async (req, res) => {
    chirp("m: validate");
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new ValidationError(errors.mapped());
  });
};
