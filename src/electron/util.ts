import { WebContents } from "electron";

export function isDev(){
    return process.env.NODE_ENV === 'development';
}