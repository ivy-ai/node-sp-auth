"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const CacheItem_1 = require("./CacheItem");
const crypto = require("crypto");
class Cache {
    constructor() {
        this._cache = {};
    }
    set(key, data, expiration) {
        let cacheItem = undefined;
        key = this.getHashKey(key);
        if (!expiration) {
            cacheItem = new CacheItem_1.CacheItem(data);
        }
        else if (typeof expiration === 'number') {
            const now = new Date();
            now.setSeconds(now.getSeconds() + expiration);
            cacheItem = new CacheItem_1.CacheItem(data, now);
        }
        else if (expiration instanceof Date) {
            cacheItem = new CacheItem_1.CacheItem(data, expiration);
        }
        this._cache[key] = cacheItem;
    }
    get(key) {
        key = this.getHashKey(key);
        const cacheItem = this._cache[key];
        if (!cacheItem) {
            return undefined;
        }
        if (!cacheItem.expiredOn) {
            return cacheItem.data;
        }
        const now = new Date();
        if (now > cacheItem.expiredOn) {
            this.remove(key);
            return undefined;
        }
        else {
            return cacheItem.data;
        }
    }
    remove(key) {
        key = this.getHashKey(key);
        delete this._cache[key];
    }
    clear() {
        this._cache = {};
    }
    getHashKey(key) {
        return crypto.createHash('md5').update(key).digest('hex');
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map