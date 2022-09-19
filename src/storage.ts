import { appendPrefix, removePrefix } from "./common.js";
import {
    BrowserStorageValue,
    StorageOptions,
    StorageValue,
    Timeout,
} from "./types.js";

export const prefix = "$PLS_STORAGE_";

export class CustomLocalStorage {
    readonly length: number = 0;
    clear = () => {
        Object.entries(this.#customStorage).forEach(([key, value]) => {
            this.#storage?.removeItem(appendPrefix(key));
            if (value.timeout) {
                clearTimeout(value.timeout);
            }
        });
        this.#customStorage = {};
        return;
    };
    getItem = (key: string) => {
        return this.#customStorage[key]?.value;
    };

    setItem = (key: string, value: unknown, options?: StorageOptions) => {
        if (value === undefined || value === null) {
            return;
        }
        const originValue = this.#customStorage[key];
        if (originValue && originValue.readOnly && !options?.force) {
            return;
        }
        const expiresAt = options?.expiresAt
            ? options?.expiresAt.toJSON()
            : undefined;
        const timeout = options?.expiresAt
            ? this.#buildTimeout(appendPrefix(key), options.expiresAt)
            : undefined;
        const JSONValue: StorageValue<unknown> = {
            value,
            expiresAt,
            timeout,
            readOnly: options?.readOnly,
        };
        const storageValue = JSON.stringify(JSONValue);
        this.#storage?.setItem(appendPrefix(key), storageValue);
        this.#customStorage[key] = JSONValue;
    };

    #customStorage: Record<string, StorageValue<unknown>> = {};
    #storage: Storage | undefined;

    /**
     * Used to build timeout function to clear key in #storage
     * @param key - Key of #storage (with prefix)
     * @param expiresAt
     */
    #buildTimeout = (key: string, expiresAt: Date): Timeout => {
        let time = new Date().getTime() - expiresAt.getTime();
        if (time < 0) {
            time = 0;
        }
        return setTimeout(() => {
            delete this.#customStorage[removePrefix(key)];
            this.#storage?.removeItem(key);
        }, time);
    };

    constructor(type?: "local" | "session") {
        if (type === "session" && sessionStorage) {
            this.#storage = sessionStorage;
        } else if (type === "local" && localStorage) {
            this.#storage = localStorage;
            Object.entries(this.#storage).forEach(([key, value]) => {
                if (!key.startsWith(prefix) || typeof value !== "string") {
                    return;
                }
                const storageValue = JSON.parse(
                    value,
                ) as BrowserStorageValue<unknown>;
                let timeout: Timeout | undefined;
                if (storageValue.expiresAt) {
                    const expiresAt = new Date(storageValue.expiresAt);
                    const currentTime = new Date();
                    if (expiresAt < currentTime) {
                        this.#storage?.removeItem(key);
                        return;
                    }
                    timeout = this.#buildTimeout(key, expiresAt);
                }
                this.#customStorage[key.slice(prefix.length)] = {
                    ...storageValue,
                    timeout,
                };
                return;
            });
        }
    }
}
