import { NextFunction, Request, Response } from 'express';
import { isLogged, isAdmin, login } from '../../src/controllers/auth.controller';
import { User } from '../../src/models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('isLogged', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };
  });

  test('returns 401 if authorization header is not present', () => {
    isLogged(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'The token is not valid' });
  });

  test('returns 401 if authorization header does not start with Bearer ', () => {
    mockRequest.headers = { authorization: 'Basic token' };
    isLogged(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'The token is not valid' });
  });

  test('returns 401 if token is not valid', () => {
    mockRequest.headers = { authorization: 'Bearer token' };
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
    isLogged(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'The token is not valid' });
  });

  test('calls next function if token is valid', () => {
    mockRequest.headers = { authorization: 'Bearer token' };
    (jwt.verify as jest.Mock).mockReturnValue({});
    isLogged(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});

describe('isAdmin', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();
    let mockUser: any;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: { user: { username: 'testUser' } }
        };
        mockUser = {
            findOne: jest.fn()
        };
        User.findOne = mockUser.findOne;
    });

    test('calls next function if user is admin', async () => {
        mockUser.findOne.mockResolvedValue({ isAdmin: true });
        await isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(nextFunction).toHaveBeenCalled();
    });

    test('returns 401 if user is not admin', async () => {
        mockUser.findOne.mockResolvedValue({ isAdmin: false });
        await isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'The token is not valid' });
    });

    test('returns 401 if user is not found', async () => {
        mockUser.findOne.mockResolvedValue(null);
        await isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'The token is not valid' });
    });
});

describe('login', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockUser: any;

    beforeEach(() => {
        mockRequest = {
            body: {
                username: 'testUser',
                password: 'testPassword'
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockUser = {
            findOne: jest.fn()
        };
        User.findOne = mockUser.findOne;
    });

    test('returns 400 if user does not exist', async () => {
        mockUser.findOne.mockResolvedValue(null);
        await login(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
    });

    test('returns 400 if password is invalid', async () => {
        mockUser.findOne.mockResolvedValue({ password: 'wrongPassword' });
        bcrypt.compare = jest.fn().mockResolvedValue(false);
        await login(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
    });

    test('returns token if credentials are valid', async () => {
        mockUser.findOne.mockResolvedValue({ password: 'testPassword'});
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('testToken');
        await login(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.json).toHaveBeenCalledWith('testToken');
    });
});