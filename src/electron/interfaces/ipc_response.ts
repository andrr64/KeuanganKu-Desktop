import { ipcMain } from "electron";

export interface IPCResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export function ipcResponseSuccess<T>(data: T): IPCResponse<T> {
    return {
        success: true,
        data: data,
        message: 'OK'
    };
}

export function ipcResponseFailed(message: string): IPCResponse<null> {
    return {
        success: false,
        data: null,
        message: message
    };
}