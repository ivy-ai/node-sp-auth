"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineAddinOnly = void 0;
const config_1 = require("./../../config");
const url = require("url");
const Cache_1 = require("./../../utils/Cache");
const UrlHelper_1 = require("./../../utils/UrlHelper");
const consts = require("./../../Consts");
const OnlineResolver_1 = require("./base/OnlineResolver");
const HostingEnvironment_1 = require("../HostingEnvironment");
class OnlineAddinOnly extends OnlineResolver_1.OnlineResolver {
    constructor(_siteUrl, _authOptions) {
        super(_siteUrl);
        this._authOptions = _authOptions;
    }
    getAuth() {
        const sharepointhostname = url.parse(this._siteUrl).hostname;
        const cacheKey = `${sharepointhostname}@${this._authOptions.clientSecret}@${this._authOptions.clientId}`;
        const cachedToken = OnlineAddinOnly.TokenCache.get(cacheKey);
        if (cachedToken) {
            return Promise.resolve({
                headers: {
                    'Authorization': `Bearer ${cachedToken}`
                }
            });
        }
        return this.getRealm(this._siteUrl)
            .then(realm => {
            return Promise.all([realm, this.getAuthUrl(realm)]);
        })
            .then(data => {
            const realm = data[0];
            const authUrl = data[1];
            const resource = `${consts.SharePointServicePrincipal}/${sharepointhostname}@${realm}`;
            const fullClientId = `${this._authOptions.clientId}@${realm}`;
            return config_1.request.post(authUrl, {
                form: {
                    'grant_type': 'client_credentials',
                    'client_id': fullClientId,
                    'client_secret': this._authOptions.clientSecret,
                    'resource': resource
                }
            }).json();
        })
            .then(data => {
            const expiration = parseInt(data.expires_in, 10);
            OnlineAddinOnly.TokenCache.set(cacheKey, data.access_token, expiration - 60);
            return {
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                }
            };
        });
    }
    InitEndpointsMappings() {
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.Production, 'accounts.accesscontrol.windows.net');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.China, 'accounts.accesscontrol.chinacloudapi.cn');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.German, 'login.microsoftonline.de');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.USDefence, 'accounts.accesscontrol.windows.net');
        this.endpointsMappings.set(HostingEnvironment_1.HostingEnvironment.USGovernment, 'accounts.accesscontrol.windows.net');
    }
    getAuthUrl(realm) {
        return new Promise((resolve, reject) => {
            const url = this.AcsRealmUrl + realm;
            config_1.request.get(url).json()
                .then((data) => {
                for (let i = 0; i < data.endpoints.length; i++) {
                    if (data.endpoints[i].protocol === 'OAuth2') {
                        resolve(data.endpoints[i].location);
                        return undefined;
                    }
                }
            })
                .catch(reject);
        });
    }
    get AcsRealmUrl() {
        return `https://${this.endpointsMappings.get(this.hostingEnvironment)}/metadata/json/1?realm=`;
    }
    getRealm(siteUrl) {
        if (this._authOptions.realm) {
            return Promise.resolve(this._authOptions.realm);
        }
        return config_1.request.post(`${UrlHelper_1.UrlHelper.removeTrailingSlash(siteUrl)}/_vti_bin/client.svc`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer '
            }
        })
            .then(data => {
            const header = data.headers['www-authenticate'];
            const index = header.indexOf('Bearer realm="');
            return header.substring(index + 14, index + 50);
        });
    }
}
exports.OnlineAddinOnly = OnlineAddinOnly;
OnlineAddinOnly.TokenCache = new Cache_1.Cache();
//# sourceMappingURL=OnlineAddinOnly.js.map