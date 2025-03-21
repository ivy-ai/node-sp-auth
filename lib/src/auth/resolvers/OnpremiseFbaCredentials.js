"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnpremiseFbaCredentials = void 0;
const url = require("url");
const config_1 = require("./../../config");
const cookie = require("cookie");
const lodash = require('lodash');
const xmldoc = require('xmldoc');
const Cache_1 = require("./../../utils/Cache");
const consts = require("./../../Consts");
const FbaLoginWsfed_1 = require("./../../templates/FbaLoginWsfed");
class OnpremiseFbaCredentials {
    constructor(_siteUrl, _authOptions) {
        this._siteUrl = _siteUrl;
        this._authOptions = _authOptions;
    }
    getAuth() {
        const parsedUrl = url.parse(this._siteUrl);
        const host = parsedUrl.host;
        const cacheKey = `${host}@${this._authOptions.username}@${this._authOptions.password}`;
        const cachedCookie = OnpremiseFbaCredentials.CookieCache.get(cacheKey);
        if (cachedCookie) {
            return Promise.resolve({
                headers: {
                    'Cookie': cachedCookie
                }
            });
        }
        const soapBody = lodash.template(FbaLoginWsfed_1.template)({
            username: this._authOptions.username,
            password: this._authOptions.password
        });
        const fbaEndPoint = `${parsedUrl.protocol}//${host}/${consts.FbaAuthEndpoint}`;
        return config_1.request({
            url: fbaEndPoint,
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'Content-Length': soapBody.length.toString()
            },
            body: soapBody
        })
            .then(response => {
            const xmlDoc = new xmldoc.XmlDocument(response.body);
            if (xmlDoc.name === 'm:error') {
                const errorCode = xmlDoc.childNamed('m:code').val;
                const errorMessage = xmlDoc.childNamed('m:message').val;
                throw new Error(`${errorCode}, ${errorMessage}`);
            }
            const errorCode = xmlDoc.childNamed('soap:Body').childNamed('LoginResponse').childNamed('LoginResult').childNamed('ErrorCode').val;
            const cookieName = xmlDoc.childNamed('soap:Body').childNamed('LoginResponse').childNamed('LoginResult').childNamed('CookieName').val;
            const diffSeconds = parseInt(xmlDoc.childNamed('soap:Body').childNamed('LoginResponse').childNamed('LoginResult').childNamed('TimeoutSeconds').val, null);
            let cookieValue;
            if (errorCode === 'PasswordNotMatch') {
                throw new Error('Password doesn\'t not match');
            }
            if (errorCode !== 'NoError') {
                throw new Error(errorCode);
            }
            (response.headers['set-cookie'] || []).forEach((headerCookie) => {
                if (headerCookie.indexOf(cookieName) !== -1) {
                    cookieValue = cookie.parse(headerCookie)[cookieName];
                }
            });
            const authCookie = `${cookieName}=${cookieValue}`;
            OnpremiseFbaCredentials.CookieCache.set(cacheKey, authCookie, diffSeconds);
            return {
                headers: {
                    'Cookie': authCookie
                }
            };
        });
    }
}
exports.OnpremiseFbaCredentials = OnpremiseFbaCredentials;
OnpremiseFbaCredentials.CookieCache = new Cache_1.Cache();
//# sourceMappingURL=OnpremiseFbaCredentials.js.map