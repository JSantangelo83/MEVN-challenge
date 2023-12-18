import BaseService from "./BaseService";

export default class LoginService extends BaseService {
    constructor() {
        // LoginService does not require authentication to access its endpoints
        super(false, '/auth')
    }
    public async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await this.post<LoginResponse>('/login', data);
        return response.data;
    }
}

interface LoginRequest {
    username: string;
    password: string;
}

export interface CurrentUser {
    id: number;
    username: string;
    isAdmin: boolean;
}
interface LoginResponse {
    token: string;
    currentUser: CurrentUser
}