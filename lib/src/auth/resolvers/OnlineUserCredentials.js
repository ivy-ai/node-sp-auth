"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineUserCredentials = void 0;
const url = require("url");
const config_1 = require("./../../config");
const cookie = require("cookie");
const lodash = require('lodash');
const xmldoc = require('xmldoc');
const Cache_1 = require("./../../utils/Cache");
const consts = require("./../../Consts");
const AdfsHelper_1 = require("./../../utils/AdfsHelper");
const OnlineSamlWsfedAdfs_1 = require("./../../templates/OnlineSamlWsfedAdfs");
const OnlineSamlWsfed_1 = require("./../../templates/OnlineSamlWsfed");
const HostingEnvironment_1 = require("../HostingEnvironment");
const OnlineResolver_1 = require("./base/OnlineResolver");
class OnlineUserCredentials extends OnlineResolver_1.OnlineResolver {
    constructor(_siteUrl, _authOptions) {
        super(_siteUrl);
        this._authOptions = _authOptions;
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
    }
    getAuth() {
        const parsedUrl = url.parse(this._siteUrl);
        const host = parsedUrl.host;
        const cacheKey = `${host}@${this._authOptions.username}@${this._authOptions.password}`;
        const cachedCookie = OnlineUserCredentials.CookieCache.get(cacheKey);
        if (cachedCookie) {
            return Promise.resolve({
                headers: {
                    'Cookie': cachedCookie
                }
            });
        }
        return this.getSecurityToken()
            .then(xmlResponse => {
            return this.postToken(xmlResponse);
        })
            .then(data => {
            const response = data[1];
            const diffSeconds = data[0];
            let fedAuth;
            let rtFa;
            for (let i = 0; i < response.headers['set-cookie'].length; i++) {
                const headerCookie = response.headers['set-cookie'][i];
                if (headerCookie.indexOf(consts.FedAuth) !== -1) {
                    fedAuth = cookie.parse(headerCookie)[consts.FedAuth];
                }
                if (headerCookie.indexOf(consts.RtFa) !== -1) {
                    rtFa = cookie.parse(headerCookie)[consts.RtFa];
                }
            }
            const authCookie = 'FedAuth=' + fedAuth + '; rtFa=' + rtFa;
            OnlineUserCredentials.CookieCache.set(cacheKey, authCookie, diffSeconds);
            return {
                headers: {
                    'Cookie': authCookie
                }
            };
        });
    }
    InitEndpointsMappings() {
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.Production, 'login.microsoftonline.com');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.China, 'login.chinacloudapi.cn');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.German, 'login.microsoftonline.de');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.USDefence, 'login-us.microsoftonline.com');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.USGovernment, 'login.microsoftonline.us');
    }
    getSecurityToken() {
        return config_1.request.post(this.OnlineUserRealmEndpoint, {
            form: {
                'login': this._authOptions.username
            }
        }).json()
            .then((userRealm) => {
            const authType = userRealm.NameSpaceType;
            if (!authType) {
                throw new Error('Unable to define namespace type for Online authentiation');
            }
            if (authType === 'Managed') {
                return this.getSecurityTokenWithOnline();
            }
            if (authType === 'Federated') {
                return this.getSecurityTokenWithAdfs(userRealm.AuthURL, userRealm.CloudInstanceIssuerUri);
            }
            throw new Error(`Unable to resolve namespace authentiation type. Type received: ${authType}`);
        });
    }
    getSecurityTokenWithAdfs(adfsUrl, relyingParty) {
        return AdfsHelper_1.AdfsHelper.getSamlAssertion({
            username: this._authOptions.username,
            password: this._authOptions.password,
            adfsUrl: adfsUrl,
            relyingParty: relyingParty || consts.AdfsOnlineRealm
        })
            .then(samlAssertion => {
            const siteUrlParsed = url.parse(this._siteUrl);
            const rootSiteUrl = siteUrlParsed.protocol + '//' + siteUrlParsed.host;
            const tokenRequest = lodash.template(OnlineSamlWsfedAdfs_1.template)({
                endpoint: rootSiteUrl,
                token: samlAssertion.value
            });
            return config_1.request.post(this.MSOnlineSts, {
                body: tokenRequest,
                headers: {
                    'Content-Length': tokenRequest.length.toString(),
                    'Content-Type': 'application/soap+xml; charset=utf-8'
                },
                resolveBodyOnly: true
            });
        });
    }
    getSecurityTokenWithOnline() {
        const parsedUrl = url.parse(this._siteUrl);
        const host = parsedUrl.host;
        const spFormsEndPoint = `${parsedUrl.protocol}//${host}/${consts.FormsPath}`;
        const samlBody = lodash.template(OnlineSamlWsfed_1.template)({
            username: this._authOptions.username,
            password: this._authOptions.password,
            endpoint: spFormsEndPoint
        });
        return config_1.request
            .post(this.MSOnlineSts, {
            body: samlBody,
            resolveBodyOnly: true,
            headers: {
                'Content-Type': 'application/soap+xml; charset=utf-8'
            }
        });
    }
    postToken(xmlResponse) {
        const xmlDoc = new xmldoc.XmlDocument(xmlResponse);
        const parsedUrl = url.parse(this._siteUrl);
        const spFormsEndPoint = `${parsedUrl.protocol}//${parsedUrl.host}/${consts.FormsPath}`;
        const securityTokenResponse = xmlDoc.childNamed('S:Body').firstChild;
        if (securityTokenResponse.name.indexOf('Fault') !== -1) {
            throw new Error(securityTokenResponse.toString());
        }
        const binaryToken = securityTokenResponse.childNamed('wst:RequestedSecurityToken').firstChild.val;
        const now = new Date().getTime();
        const expires = new Date(securityTokenResponse.childNamed('wst:Lifetime').childNamed('wsu:Expires').val).getTime();
        const diff = (expires - now) / 1000;
        const diffSeconds = parseInt(diff.toString(), 10);
        return Promise.all([Promise.resolve(diffSeconds), config_1.request
                .post(spFormsEndPoint, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0)',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: binaryToken
            })]);
    }
    get MSOnlineSts() {
        return `https://${this.endpointsMappings.get(this.hostingEnvironment)}/extSTS.srf`;
    }
    get OnlineUserRealmEndpoint() {
        return `https://${this.endpointsMappings.get(this.hostingEnvironment)}/GetUserRealm.srf`;
    }
}
exports.OnlineUserCredentials = OnlineUserCredentials;
OnlineUserCredentials.CookieCache = new Cache_1.Cache();
//# sourceMappingURL=OnlineUserCredentials.js.map