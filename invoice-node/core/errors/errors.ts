export class GenericError extends Error {
  extras?: any;
  constructor(message: string, extras?: any) {
    super(message);
    this.extras = extras;
  }
};

export class ServerError extends GenericError { }

export class RequestError extends GenericError {
  code?: number;
  constructor(code: number, message: string, extras?: any) {
    super(message, extras);
    this.code = code;
  }
};

export class BadRequestError extends RequestError {
  constructor(message: string, extras?: any) {
    super(400, message, extras);
  }
};

export class ValidationError extends BadRequestError {
  constructor(errors: any) {
    super("validation error", errors);
  }
};
