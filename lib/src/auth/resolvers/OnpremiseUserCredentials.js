"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnpremiseUserCredentials = void 0;
const url = require("url");
const config_1 = require("./../../config");
const http = require("http");
const https = require("https");
const ntlm = require('node-ntlm-client/lib/ntlm');
class OnpremiseUserCredentials {
    constructor(_siteUrl, _authOptions) {
        this._siteUrl = _siteUrl;
        this._authOptions = _authOptions;
    }
    getAuth() {
        const ntlmOptions = Object.assign({}, this._authOptions);
        ntlmOptions.url = this._siteUrl;
        if (ntlmOptions.username.indexOf('\\') > 0) {
            const parts = ntlmOptions.username.split('\\');
            ntlmOptions.username = parts[1];
            ntlmOptions.domain = parts[0].toUpperCase();
        }
        if (ntlmOptions.username.indexOf('@') > 0) {
            ntlmOptions.domain = '';
        }
        const type1msg = ntlm.createType1Message();
        const isHttps = url.parse(this._siteUrl).protocol === 'https:';
        const keepaliveAgent = isHttps ? new https.Agent({ keepAlive: true, rejectUnauthorized: !!ntlmOptions.rejectUnauthorized }) :
            new http.Agent({ keepAlive: true });
        return config_1.request({
            url: this._siteUrl,
            method: 'GET',
            headers: {
                'Connection': 'keep-alive',
                'Authorization': type1msg,
                'Accept': 'application/json;odata=verbose'
            },
            agent: keepaliveAgent
        })
            .then(response => {
            const type2msg = ntlm.decodeType2Message(response.headers['www-authenticate']);
            const type3msg = ntlm.createType3Message(type2msg, ntlmOptions.username, ntlmOptions.password, ntlmOptions.workstation, ntlmOptions.domain);
            return {
                headers: {
                    'Connection': 'Close',
                    'Authorization': type3msg
                },
                options: {
                    agent: keepaliveAgent
                }
            };
        });
    }
}
exports.OnpremiseUserCredentials = OnpremiseUserCredentials;
//# sourceMappingURL=OnpremiseUserCredentials.js.map