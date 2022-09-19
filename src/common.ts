import { prefix } from "./storage.js";

export const appendPrefix = (key: string): string => {
    return `${prefix}${key}`;
};

export const removePrefix = (key: string): string => {
    return key.slice(prefix.length);
};
