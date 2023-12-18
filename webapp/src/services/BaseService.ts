import axios, { AxiosResponse } from "axios";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/Errors";

export default class BaseService {
    apiUrl: string;
    useAuth: boolean;
    token: string | null = localStorage.getItem("token");
    route: string;
    constructor(useAuth: boolean, route: string) {
        this.apiUrl = "http://localhost:3000";
        this.useAuth = useAuth;
        this.route = route;
    }

    async get<T>(method: string) {
        this.handleAuth();
        const response = await axios.get<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`)
        return this.handleResponse<T>(response);
    }

    async post<T>(method: string, data: unknown) {
        this.handleAuth();
        const response = await axios.post<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`, data);
        return this.handleResponse<T>(response);
    }

    async put<T>(method: string, data: unknown) {
        this.handleAuth();
        const response = await axios.put<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`, data);
        return this.handleResponse<T>(response);
    }

    async delete<T>(method: string) {
        this.handleAuth();
        const response = await axios.delete<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`);
        return this.handleResponse<T>(response);
    }

    handleAuth() {
        if (this.useAuth) {
            if (!this.token) {
                delete axios.defaults.headers.common['Authorization'];
                throw new UnauthorizedError("This endpoint requires authentication");
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }
    }

    handleResponse<T>(response: AxiosResponse<BaseResponse<T>>): BaseResponseSuccess<T> {
        if (response.status !== 200) {
            if (response.status === 400) {
                throw new BadRequestError((response.data as BaseResponseError).error);
            }

            if (response.status === 401) {
                throw new UnauthorizedError((response.data as BaseResponseError).error);
            }

            if (response.status === 403) {
                throw new ForbiddenError((response.data as BaseResponseError).error);
            }

            if (response.status === 404) {
                throw new NotFoundError((response.data as BaseResponseError).error);
            }

            if (response.status === 500) {
                throw new InternalServerError((response.data as BaseResponseError).error);
            }

            throw new Error(response.data.error);
        }

        return response.data as BaseResponseSuccess<T>;
    }
}

type BaseResponse<T> = BaseResponseSuccess<T> | BaseResponseError;

interface BaseResponseSuccess<T> {
    error?: never;
    // if T is null, message is string, otherwise it's undefined
    message: T extends null ? string : undefined;
    // if T is null, data is undefined, otherwise it's T
    data: T extends null ? undefined : T;
}
interface BaseResponseError {
    error: string;
    message?: never;
    data?: never;
}
