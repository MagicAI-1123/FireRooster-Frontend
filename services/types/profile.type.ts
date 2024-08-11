export interface SetProfilePayload {
    first_name: string,
    last_name: string,
    email: string,
    prompt: string
}
export interface SetProfileResponse {
    status: boolean;
    message: string;
}
export interface GetProfileResponse {
    prompt: string
}