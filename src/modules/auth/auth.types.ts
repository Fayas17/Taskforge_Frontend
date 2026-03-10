export interface RegisterPayload {
    username: string
    email: string
    password: string
    confirmpassword: string
}

export interface RegisterResponse {
    email: string
    username: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
}

export interface User {
    id: number
    email: string
    username: string
}
