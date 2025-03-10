"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnpremiseTmgCredentials = void 0;
const url = require("url");
const config_1 = require("./../../config");
const http = require("http");
const https = require("https");
const Cache_1 = require("./../../utils/Cache");
const consts = require("./../../Consts");
class OnpremiseTmgCredentials {
    constructor(_siteUrl, _authOptions) {
        this._siteUrl = _siteUrl;
        this._authOptions = _authOptions;
    }
    getAuth() {
        const parsedUrl = url.parse(this._siteUrl);
        const host = parsedUrl.host;
        const cacheKey = `${host}@${this._authOptions.username}@${this._authOptions.password}`;
        const cachedCookie = OnpremiseTmgCredentials.CookieCache.get(cacheKey);
        if (cachedCookie) {
            return Promise.resolve({
                headers: {
                    'Cookie': cachedCookie
                }
            });
        }
        const tmgEndPoint = `${parsedUrl.protocol}//${host}/${consts.TmgAuthEndpoint}`;
        const isHttps = url.parse(this._siteUrl).protocol === 'https:';
        const keepaliveAgent = isHttps ?
            new https.Agent({ keepAlive: true, rejectUnauthorized: !!this._authOptions.rejectUnauthorized }) :
            new http.Agent({ keepAlive: true });
        return config_1.request({
            url: tmgEndPoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'curl=Z2F&flags=0&forcedownlevel=0&formdir=1&trusted=0&' +
                `username=${encodeURIComponent(this._authOptions.username)}&` +
                `password=${encodeURIComponent(this._authOptions.password)}`,
            agent: keepaliveAgent
        })
            .then(response => {
            const authCookie = response.headers['set-cookie'][0];
            return {
                headers: {
                    'Cookie': authCookie
                }
            };
        });
    }
}
exports.OnpremiseTmgCredentials = OnpremiseTmgCredentials;
OnpremiseTmgCredentials.CookieCache = new Cache_1.Cache();
//# sourceMappingURL=OnpremiseTmgCredentials.js.map