import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { InvalidCredentialsError, InvalidTokenError, NotAdminError } from '../utils/Errors';
import { errorWrapper } from './error.controller';

interface LoginData extends Request {
    username: string;
    password: string;
}
export const login = errorWrapper(async (req: Request<unknown, unknown, LoginData>, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // Search user in database
    const user: any = await User.findOne({ where: { username: username } })

    // If user doesn't exist
    if (!user) {
        next(InvalidCredentialsError)
    }

    // If user exists, compare passwords
    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
        next(InvalidCredentialsError)
    }

    let signedData = {
        id: user.id,
        username: username,
        isAdmin: user.isAdmin
    }

    // Generate JWT
    const token = jwt.sign(signedData, process.env.SECRET_KEY || '<FALLBACK_SECRET_KEY>');

    res.json({
        data: {
            token: token,
            currentUser: signedData
        }
    });
})

export const isLogged = errorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers?.authorization

    if (headerToken != undefined && headerToken.startsWith('Bearer ')) {
        try {
            const bearerToken = headerToken.slice(7);
            const decoded: any = jwt.verify(bearerToken, process.env.SECRET_KEY || '<FALLBACK_SECRET_KEY>');
            res.locals.user = decoded;
            next()
        } catch (error) {
            next(InvalidTokenError)
        }
    } else {
        next(InvalidTokenError)
    }
})

export const isAdmin = errorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    // Check if user is admin using decoded token from res.locals object
    const user: any = await User.findOne({ where: { id: res.locals.user.id } });
    if (user?.isAdmin) {
        next()
    } else {
        next(NotAdminError)
    }
})