export interface IPCResponse<T> {
    status: boolean;
    data: T;
    message: string;
}