import { ipcMain } from "electron";

export interface IPCResponse<T> {
    status: boolean;
    data: T;
    message: string;
}

export function ipcResponseSuccess<T>(data: T): IPCResponse<T> {
    return {
        status: true,
        data: data,
        message: 'OK'
    };
}

export function ipcResponseFailed(message: string): IPCResponse<null> {
    return {
        status: false,
        data: null,
        message: message
    };
}