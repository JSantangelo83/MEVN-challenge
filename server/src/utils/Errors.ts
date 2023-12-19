export class DefaultError extends Error {
    error: string;
    status: number = 502;
    constructor(error: string) {
        super(error)
        this.error = error;
    }
}

class UnauthorizedError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.status = 401;
    }
}

class ForbiddenError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.status = 403;
    }
}

class NotFoundError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.status = 404;
    }
}

class BadRequestError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.status = 400;
    }
}

class InternalServerError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.status = 500;
    }
}


export const UsernameTakenError = new BadRequestError('Username is already taken');
export const DeletingYourselfError = new BadRequestError('You cannot delete yourself');
export const InvalidCredentialsError = new UnauthorizedError('Invalid Credentials')
export const InvalidTokenError = new UnauthorizedError('Invalid Token')
export const NotAdminError = new ForbiddenError('You must be an admin to perform this action');
export const UserNotFoundError = new NotFoundError('User not found');
export const UnhandledInternalError = new InternalServerError('There was an internal error');