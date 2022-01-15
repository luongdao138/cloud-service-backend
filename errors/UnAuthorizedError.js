import { CustomError } from './CustomError.js';
import { StatusCodes } from 'http-status-codes';

export class UnAuthorizedError extends CustomError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
