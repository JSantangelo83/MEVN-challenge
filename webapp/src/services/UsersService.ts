import BaseService from "./BaseService";

export default class UsersService extends BaseService<User> {
    constructor() {
        // UsersService requires authentication to access its endpoints
        super(true,'/users');
    }
    public async getAllUsers() {
        const response = await this.get('/');
        return response.data;
    }

    public async createUser(data: UserPassword) {
        const response = await this.post('/', data);
        return response.data;
    }

    public async updateUser(data: UserPassword) {
        const response = await this.put(`/${data.id}`, data);
        return response.data;
    }

    public async getUser(data: FindUserRequest) {
        const response = await this.get(`/${data.id}`);
        return response.data;
    }

    public async deleteUser(data: FindUserRequest) {
        const response = await this.delete(`/${data.id}`);
        return response.data;
    }
}

interface User {
    id: number;
    username: string;
    isAdmin: boolean;
}

interface UserPassword extends User {
    password: string;
}

interface FindUserRequest {
    id: number;
}