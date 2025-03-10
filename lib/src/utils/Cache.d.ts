export declare class Cache {
    private _cache;
    set<T>(key: string, data: T, expiration?: number | Date): void;
    get<T>(key: string): T;
    remove(key: string): void;
    clear(): void;
    private getHashKey;
}
