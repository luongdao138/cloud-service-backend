import { CustomError } from './CustomError.js';
import { StatusCodes } from 'http-status-codes';

export class BadRequestError extends CustomError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
