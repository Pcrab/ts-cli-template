export type Timeout = ReturnType<typeof setTimeout>;

export interface BrowserStorageValue<T> {
    value: T;
    readOnly: boolean | undefined;
    expiresAt: string | undefined;
}

export interface StorageValue<T> extends BrowserStorageValue<T> {
    timeout: Timeout | undefined;
}

export interface StorageOptions {
    readOnly?: boolean;
    expiresAt?: Date;
    force?: boolean;
}
