import BaseService from "./BaseService";

export default class LoginService extends BaseService<LoginResponse> {
    constructor() {
        super(false, '/auth')
    }
    public async login(data: LoginRequest) {
        const response = await this.post('/login', data);
        return response.data;
    }
}

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}