import { Error } from "mongoose";
import { HttpCodes } from "./constants";


export class HttpError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: HttpCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ServerError extends HttpError {
  constructor(message: string) {
    super(message, HttpCodes.SERVER_ERROR);
  }
}

export class NotFoundError extends HttpError {
  constructor() {
    super('Page not found', HttpCodes.NOT_FOUND);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(message, HttpCodes.CONFLICT);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, HttpCodes.BAD_REQUEST);
  }
}
