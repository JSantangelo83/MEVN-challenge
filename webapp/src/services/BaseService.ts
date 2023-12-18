import axios, { AxiosResponse } from "axios";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/Errors";

export default class BaseService<T> {
    apiUrl: string;
    useAuth: boolean;
    token: string | null = localStorage.getItem("token");
    route: string;
    constructor(useAuth: boolean, route: string) {
        // this.apiUrl = process.env.API_URL || "";
        this.apiUrl = "http://localhost:3000";
        this.useAuth = useAuth;
        this.route = route;
    }

    async get(method: string) {
        this.handleAuth();
        const response = await axios.get<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`)
        return this.handleResponse(response);
    }

    async post(method: string, data: unknown) {
        this.handleAuth();
        const response = await axios.post<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`, data);
        return this.handleResponse(response);
    }

    async put(method: string, data: unknown) {
        this.handleAuth();
        const response = await axios.put<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`, data);
        return this.handleResponse(response);
    }

    async delete(method: string) {
        this.handleAuth();
        const response = await axios.delete<BaseResponse<T>>(`${this.apiUrl}${this.route}${method}`);
        return this.handleResponse(response);
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

    handleResponse(response: AxiosResponse<BaseResponse<T>>): BaseResponseData<T> {
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

        return response.data as BaseResponseData<T>;
    }
}

type BaseResponse<T> = BaseResponseData<T> | BaseResponseError;

interface BaseResponseData<T> extends BaseResponseMessage {
    data: T;
}

interface BaseResponseMessage {
    error?: never;
    message: string;
}

interface BaseResponseError {
    error: string;
    message?: never;
}
