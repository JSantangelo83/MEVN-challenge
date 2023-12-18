export class DefaultError extends Error {
    error: string;
    name: string;
    title: string;
    constructor(error: string) {
        super(error)
        this.error = error;
        this.name = "DefaultError";
        this.title = "There was an Error!";
    }
}

export class UnauthorizedError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.name = "UnauthorizedError";
        this.title = "Unauthorized!";
    }
}

export class ForbiddenError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.name = "ForbiddenError";
        this.title = "Forbidden!";
    }
}

export class NotFoundError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.name = "NotFoundError";
        this.title = "Not Found!";
    }
}

export class BadRequestError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.name = "BadRequestError";
        this.title = "Bad Request!";
    }
}

export class InternalServerError extends DefaultError {
    constructor(error: string) {
        super(error);
        this.name = "InternalServerError";
        this.title = "Internal Server Error!";
    }
}
