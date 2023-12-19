import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';
import { DeletingYourselfError, UserNotFoundError, UsernameTakenError } from '../utils/Errors';
import { errorWrapper } from './error.controller';

export const listUsers = errorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Find all users and remove the password field
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    })

    res.json({ data: users });
})

export const deleteUser = errorWrapper(async (req: Request<FindUserData>, res: Response, next: NextFunction) => {
    const id = req.params.id;

    // Check if user is deleting himself
    if (id == res.locals?.user.id) {
        return next(DeletingYourselfError)
    }

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
        return next(UserNotFoundError);

    }

    // Delete user
    await User.destroy({ where: { id: id } })

    res.json({ message: 'User deleted successfully' });
})

export const createUser = errorWrapper(async (req: Request<unknown, unknown, UserPasswordData>, res: Response, next: NextFunction) => {
    const { username, password, isAdmin } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate username    
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
        return  next(UsernameTakenError);
    }

    // Create user
    const user = await User.create({
        username: username,
        password: hashedPassword,
        isAdmin: isAdmin
    } as User);

    res.json({ message: 'User created successfully', data: user });
})

export const updateUser = errorWrapper(async (req: Request<FindUserData, unknown, UserPasswordData>, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { username, password, isAdmin } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
        return next(UserNotFoundError)
    }

    // Locate updated properties
    const updatedProperties: any = {};
    if (username && username !== user?.username) {
        updatedProperties.username = username;
        // Validate username    
        const existingUser = await User.findOne({ where: { username: username } });
        if (existingUser && existingUser.id != Number(id)) {
            return  next(UsernameTakenError);
        }
    }
    if (isAdmin !== undefined && isAdmin !== user?.isAdmin) updatedProperties.isAdmin = isAdmin;
    if (password) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedProperties.password = hashedPassword;
    }

    // Update user
    await User.update(updatedProperties as User, { where: { id: id } });

    // Fetch the updated user without the password
    const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });

    res.json({ message: 'User updated successfully', data: updatedUser });
})


interface FindUserData {
    id: number;
}

interface UserData {
    id: number;
    username: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UserPasswordData extends UserData {
    password: string;
}