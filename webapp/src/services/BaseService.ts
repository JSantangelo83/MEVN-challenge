import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../utils/Errors";
import { swalSuccess } from "../helpers/SwalHelper";

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
        const response = await this.getResponse<BaseResponse<T>>(axios.get(`${this.apiUrl}${this.route}${method}`));
        return this.handleResponse<T>(response);
    }

    async post<T>(method: string, data: unknown) {
        this.handleAuth();
        const response = await this.getResponse<BaseResponse<T>>(axios.post(`${this.apiUrl}${this.route}${method}`, data));
        return this.handleResponse<T>(response);
    }

    async put<T>(method: string, data: unknown) {
        this.handleAuth();
        const response = await this.getResponse<BaseResponse<T>>(axios.put(`${this.apiUrl}${this.route}${method}`, data));
        return this.handleResponse<T>(response);
    }

    async delete<T>(method: string) {
        this.handleAuth();
        const response = await this.getResponse<BaseResponse<T>>(axios.delete(`${this.apiUrl}${this.route}${method}`));
        return this.handleResponse<T>(response);
    }

    async getResponse<T>(method: AxiosPromise<T>): Promise<AxiosResponse<T>> {
        //Get the response from the server (in any case, even if it's an error)   
        try {
            const response = await method;
            return response;
        } catch (error) {
            const axiosError = error as AxiosError;
            return axiosError.response as AxiosResponse<T>;
        }
    }

    handleAuth() {
        if (this.useAuth) {
            this.token = localStorage.getItem("token");
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
                console.log(response.status)
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

        if (response.data.message) {
            swalSuccess(response.data.message);
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
export interface BaseResponseError {
    error: string;
    message?: never;
    data?: never;
}
