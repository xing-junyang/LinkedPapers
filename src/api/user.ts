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

export interface UserInfo {
    userId: string
    username: string
    email: string
    role: UserRole
    registerTime: string
    lastLoginTime: string
    vipExpireTime: string
}

export const userApi = {
    // 登录
    login(data: LoginForm) {
        return axios.post<ApiResponse<string>>('/api/users/login', null, {params: {email: data.email, password: data.password}})
    },

    // 注册
    register(data: RegisterForm) {
        return axios.post<ApiResponse<RegisterResponseData>>('/api/users/register', data)
    },

    // 获取用户信息
    getUserInfo() {
        return axios.get<ApiResponse<UserInfo>>('/api/users/getUserInfo', { headers: { token: sessionStorage.getItem('token') } })
    },

    // 获取浏览历史
    getHistory(userId: string) {
        console.log(userId)
        return axios.get<HistoryResponse>('/api/users/getUserHistory', { headers: { token: sessionStorage.getItem('token')}, params: userId })
    },

    // 更新用户角色
    updateRole(userId: string, role: UserRole) {
        console.log(userId, role)
        return axios.get<UpdateRoleResponse>(`/api/users/updateUserRole`, { headers: { token: sessionStorage.getItem('token') }, params: { userId: Number(userId), role: role } })
    }
}