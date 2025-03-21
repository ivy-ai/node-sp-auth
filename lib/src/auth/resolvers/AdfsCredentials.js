"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdfsCredentials = void 0;
const config_1 = require("./../../config");
const url = require("url");
const cookie = require("cookie");
const lodash = require('lodash');
const xmldoc = require('xmldoc');
const Cache_1 = require("./../../utils/Cache");
const consts = require("./../../Consts");
const AdfsHelper_1 = require("./../../utils/AdfsHelper");
const AdfsSamlToken_1 = require("./../../templates/AdfsSamlToken");
class AdfsCredentials {
    constructor(_siteUrl, _authOptions) {
        this._siteUrl = _siteUrl;
        this._authOptions = Object.assign({}, _authOptions);
        this._authOptions.username = this._authOptions.username
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        this._authOptions.password = this._authOptions.password
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        if (this._authOptions.domain !== undefined) {
            this._authOptions.username = `${this._authOptions.domain}\\${this._authOptions.username}`;
        }
    }
    getAuth() {
        const siteUrlParsed = url.parse(this._siteUrl);
        const cacheKey = `${siteUrlParsed.host}@${this._authOptions.username}@${this._authOptions.password}`;
        const cachedCookie = AdfsCredentials.CookieCache.get(cacheKey);
        if (cachedCookie) {
            return Promise.resolve({
                headers: {
                    'Cookie': cachedCookie
                }
            });
        }
        return AdfsHelper_1.AdfsHelper.getSamlAssertion(this._authOptions)
            .then((data) => {
            return this.postTokenData(data);
        })
            .then(data => {
            const adfsCookie = this._authOptions.adfsCookie || consts.FedAuth;
            const notAfter = new Date(data[0]).getTime();
            const expiresIn = parseInt(((notAfter - new Date().getTime()) / 1000).toString(), 10);
            const response = data[1];
            const authCookie = adfsCookie + '=' +
                response.headers['set-cookie']
                    .map((cookieString) => cookie.parse(cookieString)[adfsCookie])
                    .filter((cookieString) => typeof cookieString !== 'undefined')[0];
            AdfsCredentials.CookieCache.set(cacheKey, authCookie, expiresIn);
            return {
                headers: {
                    'Cookie': authCookie
                }
            };
        });
    }
    postTokenData(samlAssertion) {
        const result = lodash.template(AdfsSamlToken_1.template)({
            created: samlAssertion.notBefore,
            expires: samlAssertion.notAfter,
            relyingParty: this._authOptions.relyingParty,
            token: samlAssertion.value
        });
        const tokenXmlDoc = new xmldoc.XmlDocument(result);
        const siteUrlParsed = url.parse(this._siteUrl);
        const rootSiteUrl = `${siteUrlParsed.protocol}//${siteUrlParsed.host}`;
        return Promise.all([samlAssertion.notAfter, config_1.request.post(`${rootSiteUrl}/_trust/`, {
                form: {
                    'wa': 'wsignin1.0',
                    'wctx': `${rootSiteUrl}/_layouts/Authenticate.aspx?Source=%2F`,
                    'wresult': tokenXmlDoc.toString({ compressed: true })
                }
            })]);
    }
}
exports.AdfsCredentials = AdfsCredentials;
AdfsCredentials.CookieCache = new Cache_1.Cache();
//# sourceMappingURL=AdfsCredentials.js.map