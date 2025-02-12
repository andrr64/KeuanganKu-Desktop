export interface IPCResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export function ipcResponseSuccess<T>(data: T): IPCResponse<T> {
    return {
        success: true,
        data,
        message: 'Operation successful'
    };
}

export function ipcResponseError(message: string): IPCResponse<null> {
    return {
        success: false,
        data: null,
        message
    };
}