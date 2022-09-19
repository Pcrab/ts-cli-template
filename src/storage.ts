import {
    BrowserStorageValue,
    StorageOptions,
    StorageValue,
    Timeout,
} from "./types.js";

const prefix = "$PLS_STORAGE_";

export class CustomLocalStorage {
    readonly length: number = 0;
    clear = () => {
        Object.entries(this.#customStorage).forEach(([key, value]) => {
            this.#storage?.removeItem(key);
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
        const originValue = this.#customStorage[key];
        if (originValue && originValue.readOnly && options?.force) {
            return;
        }
        const expiresAt = options?.expiresAt
            ? options?.expiresAt.toJSON()
            : undefined;
        const JSONValue: StorageValue<unknown> = {
            value,
            expiresAt,
            readOnly: options?.readOnly || false,
            timeout: options?.expiresAt
                ? this.#buildTimeout(key, options.expiresAt)
                : undefined,
        };
        const storageValue = JSON.stringify(JSONValue);
        this.#storage?.setItem(key, storageValue);
        this.#customStorage[key] = JSONValue;
    };

    #customStorage: Record<string, StorageValue<unknown>> = {};
    #storage: Storage | undefined;

    #buildTimeout = (key: string, expiresAt: Date): Timeout => {
        let time = new Date().getTime() - expiresAt.getTime();
        if (time < 0) {
            time = 0;
        }
        return setTimeout(() => {
            delete this.#customStorage[key];
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
                this.#customStorage[key] = {
                    ...storageValue,
                    timeout,
                };
                return;
            });
        }
    }
}
