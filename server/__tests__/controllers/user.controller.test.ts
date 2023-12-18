import { Request, Response } from 'express';
import { updateUser, listUsers, deleteUser, createUser } from '../../src/controllers/user.controller';
import { User } from '../../src/models/user.model';
import bcrypt from 'bcrypt';

jest.mock('../../src/models/user.model');
jest.mock('bcrypt');

describe('listUsers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: jest.Mock;
    let json: jest.Mock;

    beforeEach(() => {
        status = jest.fn().mockReturnThis();
        json = jest.fn().mockReturnThis();
        req = {};
        res = { status, json };
    });

    it('returns all users without password', async () => {
        const mockUsers = [
            { id: '1', username: 'test', password: 'password', isAdmin: false },
            { id: '2', username: 'test2', password: 'password2', isAdmin: true }
        ];
        (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

        await listUsers(req as Request, res as Response);

        expect(User.findAll).toHaveBeenCalledWith({ attributes: { exclude: ['password'] } });
        expect(json).toHaveBeenCalledWith(mockUsers);
    });

    it('returns an empty array if no users are found', async () => {
        (User.findAll as jest.Mock).mockResolvedValue([]);

        await listUsers(req as Request, res as Response);

        expect(json).toHaveBeenCalledWith([]);
    });

    it('returns a 500 status code when an error occurs', async () => {
        (User.findAll as jest.Mock).mockRejectedValue(new Error('Test error'));

        await listUsers(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: 'Test error' });
    });

});

describe('deleteUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: jest.Mock;
    let json: jest.Mock;

    beforeEach(() => {
        status = jest.fn().mockReturnThis();
        json = jest.fn().mockReturnThis();
        req = { params: { id: '1' } };
        res = { status, json };
    });

    it('returns 404 if user is not found', async () => {
        (User.findByPk as jest.Mock).mockResolvedValue(null);

        await deleteUser(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('deletes the user if found', async () => {
        const mockUser = { id: '1', username: 'test', password: 'password', isAdmin: false };
        (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
        (User.destroy as jest.Mock).mockResolvedValue(1);

        await deleteUser(req as Request, res as Response);

        expect(User.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('returns a 500 status code when an error occurs', async () => {
        (User.destroy as jest.Mock).mockRejectedValue(new Error('Test error'));

        await deleteUser(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: 'Test error' });
    });
});

describe('createUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: jest.Mock;
    let json: jest.Mock;

    beforeEach(() => {
        status = jest.fn().mockReturnThis();
        json = jest.fn().mockReturnThis();
        req = { body: { username: 'test', password: 'password', isAdmin: false } };
        res = { status, json };
    });

    it('creates a new user', async () => {
        const mockUser = { username: 'test', password: 'password', isAdmin: false };
        (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (User.create as jest.Mock).mockResolvedValue(mockUser);

        await createUser(req as Request, res as Response);

        expect(User.create).toHaveBeenCalledWith({
            username: 'test',
            password: 'hashedPassword',
            isAdmin: false
        });
        expect(json).toHaveBeenCalledWith({ message: 'User created successfully', user: mockUser });
    });

    it('returns a 500 status code when an error occurs', async () => {
        (User.create as jest.Mock).mockRejectedValue(new Error('Test error'));

        await createUser(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: 'Test error' });
    });

});

describe('updateUser', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: jest.Mock;
    let json: jest.Mock;
  
    beforeEach(() => {
      status = jest.fn().mockReturnThis();
      json = jest.fn().mockReturnThis();
      req = { params: { id: '1' }, body: { username: 'test', password: 'password', isAdmin: false } };
      res = { status, json };
    });
  
    it('returns 404 if user is not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);
  
      await updateUser(req as Request, res as Response);
  
      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  
    it('updates the user without password field if found', async () => {
      const mockUser = { username: 'test', password: 'password', isAdmin: false };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.update as jest.Mock).mockResolvedValue([1]);
  
      await updateUser(req as Request, res as Response);
  
      expect(User.update).toHaveBeenCalledWith({
        username: 'test',
        password: 'hashedPassword',
        isAdmin: false
      }, { where: { id: '1' } }); 
      expect(User.findByPk).toHaveBeenCalledWith('1', { attributes: { exclude: ['password'] } });
      expect(json).toHaveBeenCalledWith({ message: 'User updated successfully', user: mockUser });
    });

    it('returns a 500 status code when an error occurs', async () => {
        (User.update as jest.Mock).mockRejectedValue(new Error('Test error'));

        await updateUser(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: 'Test error' });
    });
  });
  