import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Search user in database
    const user: any = await User
        .findOne({ where: { username: username } })
        .catch((err: Error) => { res.status(500).json({ error: err }) });

    // If user doesn't exist
    if (!user) {
        return res.status(401).json({
            message: 'Invalid Credentials'
        })
    }

    // If user exists, compare passwords
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
        return res.status(401).json({
            message: 'Invalid Credentials'
        })
    }

    // Generate JWT
    const token = jwt.sign({
        username: username,
        isAdmin: user.isAdmin
    }, process.env.SECRET_KEY || '<FALLBACK_SECRET_KEY>');

    res.json({ message: 'Successfully logged in', data: { token: token } });
}

export const isLogged = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers?.authorization

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        // Check if token is valid
        try {
            const bearerToken = headerToken.slice(7);
            const decoded: any = jwt.verify(bearerToken, process.env.SECRET_KEY || '<FALLBACK_SECRET_KEY>');
            // Attach decoded token to res.locals object
            res.locals.user = decoded;
            next()
        } catch (error) {
            res.status(401).json({
                message: 'Invalid Token'
            })
        }
    } else {
        res.status(401).json({
            message: 'Invalid Token'
        })
    }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    // Check if user is admin using decoded token from res.locals object
    const user: any = await User.findOne({ where: { username: res.locals.user.username } });
    if (user?.isAdmin) {
        next()
    } else {
        res.status(403).json({
            message: 'You must be an admin to perform this action'
        })
    }
}