import axios from 'axios'

interface LoginForm {
    email: string
    password: string
}

interface RegisterForm {
    username: string
    email: string
    password: string
}

interface ApiResponse<T> {
    code: number
    message: string
    data: T
}

interface LoginResponseData {
    token: string
    userInfo: {
        userId: string
        username: string
        role: 'NORMAL' | 'VIP'
    }
}

interface RegisterResponseData {
    userId: string
    username: string
}

export const userApi = {
    // 登录
    login(data: LoginForm) {
        return axios.post<ApiResponse<LoginResponseData>>('/api/auth/login', data)
    },

    // 注册
    register(data: RegisterForm) {
        return axios.post<ApiResponse<RegisterResponseData>>('/api/auth/register', data)
    }
}