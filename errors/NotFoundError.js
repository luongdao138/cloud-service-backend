import { CustomError } from './CustomError.js';
import { StatusCodes } from 'http-status-codes';

export class NotFoundError extends CustomError {
  constructor(msg) {
    super(msg);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
