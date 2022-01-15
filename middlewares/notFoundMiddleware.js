import { StatusCodes } from 'http-status-codes';

export default function notFoundMiddleware(req, res) {
  return res.status(StatusCodes.NOT_FOUND).json({
    message: 'Route not found',
  });
}
