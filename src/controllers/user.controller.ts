import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';

export const listUsers = async (req: Request, res: Response) => {
    // Find all users and remove the password field
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });

    res.json(users);
}

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await User.destroy({ where: { id: id } }).catch((error) => {
        res.status(500).json({ error: error.message });
    });

    res.json({ msg: 'User deleted successfully' });
}

export const createUser = async (req: Request, res: Response) => {
    const { username, password, isAdmin } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        username: username,
        password: hashedPassword,
        isAdmin: isAdmin
    } as User).catch((error) => {
        res.status(500).json({ error: error.message });
    });

    res.json({ msg: 'User created successfully', user: user });
}

export const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { username, password, isAdmin } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user
    await User.update({
        username: username,
        password: hashedPassword,
        isAdmin: isAdmin
    } as User, { where: { id: id } }).catch((error) => {
        res.status(500).json({ error: error.message });
    });

    // Fetch the updated user without the password
    const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });

    res.json({ msg: 'User updated successfully', user: updatedUser });
}