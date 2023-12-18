export class DefaultError extends Error {
    message: string;
    name: string;
    constructor(message: string) {
        super(message)
        this.message = message;
        this.name = "DefaultError";
    }
}

export class UnauthorizedError extends DefaultError {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends DefaultError {
    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends DefaultError {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class BadRequestError extends DefaultError {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export class InternalServerError extends DefaultError {
    constructor(message: string) {
        super(message);
        this.name = "InternalServerError";
    }
}
