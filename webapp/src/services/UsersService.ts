import BaseService from "./BaseService";

export default class UsersService extends BaseService {
    constructor() {
        // UsersService requires authentication to access its endpoints
        super(true, '/users');
    }
    public async getAllUsers(): Promise<User[]> {
        const response = await this.get<User[]>('/');
        return response.data;
    }

    public async createUser(data: UserPassword): Promise<User> {
        const response = await this.post<User>('/', data);
        return response.data;
    }

    public async updateUser(data: UserPassword): Promise<User> {
        const response = await this.put<User>(`/${data.id}`, data);
        return response.data;
    }

    public async getUser(data: FindUserRequest): Promise<User> {
        const response = await this.get<User>(`/${data.id}`);
        return response.data;
    }

    public async deleteUser(data: FindUserRequest): Promise<string> {
        const response = await this.delete<null>(`/${data.id}`);
        return response.message;
    }
}

export interface User {
    id: number;
    username: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UserPassword extends User {
    password: string;
}

interface FindUserRequest {
    id: number;
}