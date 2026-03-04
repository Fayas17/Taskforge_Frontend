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
