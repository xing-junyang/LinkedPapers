import axios from 'axios'

export type UserRole = 'NORMAL' | 'VIP'

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
        role: UserRole
    }
}

interface RegisterResponseData {
    userId: string
    username: string
}

export interface HistoryItem {
    paperId: string
    title: string
    viewTime: string
}

interface HistoryResponse {
    code: number
    data: {
        total: number
        history: HistoryItem[]
    }
}

interface UpdateRoleResponse {
    code: number
    message: string
}

export const userApi = {
    // 登录
    login(data: LoginForm) {
        return axios.post<ApiResponse<LoginResponseData>>('/api/auth/login', data)
    },

    // 注册
    register(data: RegisterForm) {
        return axios.post<ApiResponse<RegisterResponseData>>('/api/auth/register', data)
    },

    // 获取浏览历史
    getHistory(params: { page: number; size: number }) {
        return axios.get<HistoryResponse>('/api/user/history', { headers: { token: sessionStorage.getItem('token') ,}, params: params })
    },

    // 更新用户角色
    updateRole(userId: string, role: UserRole) {
        return axios.put<UpdateRoleResponse>(`/api/admin/users/${userId}/role`, { role }, { headers: { token: sessionStorage.getItem('token') } })
    }
}