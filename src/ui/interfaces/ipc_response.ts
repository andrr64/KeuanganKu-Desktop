export interface IPCResponse<T> {
    success: boolean;
    data: T;
    message: string;
}