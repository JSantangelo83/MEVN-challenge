import { NextFunction, Request, Response } from 'express';
import { isLogged, isAdmin, login } from '../../src/controllers/auth.controller';
import { User } from '../../src/models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnhandledInternalError, InvalidCredentialsError, InvalidTokenError, NotAdminError } from '../../src/utils/Errors';

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
        
        expect(nextFunction).toHaveBeenCalledWith(InvalidTokenError);
    });

    test('returns 401 if authorization header does not start with Bearer ', () => {
        mockRequest.headers = { authorization: 'Basic token' };
        isLogged(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalledWith(InvalidTokenError);
    });

    test('returns 401 if token is not valid', () => {
        mockRequest.headers = { authorization: 'Bearer token' };
        (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
        isLogged(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalledWith(InvalidTokenError);
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

    test('returns 403 if user is not admin', async () => {
        mockUser.findOne.mockResolvedValue({ isAdmin: false });
        await isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalledWith(NotAdminError);
    });

    test('returns 403 if user is not found', async () => {
        mockUser.findOne.mockResolvedValue(null);
        await isAdmin(mockRequest as Request, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalledWith(NotAdminError);
    });
});

describe('login', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();
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

    test('returns 401 if user does not exist', async () => {
        mockUser.findOne.mockResolvedValue(null);
        await login(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(nextFunction).toHaveBeenCalledWith(InvalidCredentialsError);
    });

    test('returns 401 if password is invalid', async () => {
        mockUser.findOne.mockResolvedValue({ password: 'wrongPassword' });
        bcrypt.compare = jest.fn().mockResolvedValue(false);
        await login(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);
        expect(nextFunction).toHaveBeenCalledWith(InvalidCredentialsError);
    });

    test('returns token if credentials are valid', async () => {
        const user = { id: 1, username: 'testUser', password: 'testPassword', isAdmin: false };
        mockUser.findOne.mockResolvedValue(user);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('testToken');

        await login(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
            data: {
                token: 'testToken',
                currentUser: {
                    id: user.id,
                    username: user.username,
                    isAdmin: user.isAdmin
                }
            }
        });
    });
});