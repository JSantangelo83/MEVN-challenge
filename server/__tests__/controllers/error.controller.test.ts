import { Request, Response, NextFunction } from 'express';
import errorHandler from '../../src/controllers/error.controller';
import { DefaultError, UnhandledInternalError } from '../../src/utils/Errors';

describe('errorHandler function tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should handle DefaultError instances', () => {
    const err = new DefaultError('Sample error');

    errorHandler(err as DefaultError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(err.status);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Sample error' });
  });

  it('should handle non-DefaultError instances as UnhandledInternalError', () => {
    const err = new Error('Sample internal error');

    errorHandler(err as DefaultError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(UnhandledInternalError.status);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: UnhandledInternalError.error });
  });

});
