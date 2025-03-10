"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenHelper = void 0;
const jwt = require("jsonwebtoken");
const url_1 = require("url");
const config_1 = require("./../config");
const consts = require("./../Consts");
class TokenHelper {
    static verifyAppToken(spAppToken, oauth, audience) {
        const secret = Buffer.from(oauth.clientSecret, 'base64');
        const token = jwt.verify(spAppToken, secret);
        const realm = token.iss.substring(token.iss.indexOf('@') + 1);
        const validateAudience = !!audience;
        if (validateAudience) {
            const validAudience = `${oauth.clientId}/${audience}@${realm}`;
            if (validAudience !== token.aud) {
                throw new Error('SP app token validation failed: invalid audience');
            }
        }
        token.realm = realm;
        token.context = JSON.parse(token.appctx);
        return token;
    }
    static getUserAccessToken(spSiteUrl, authData, oauth) {
        const spAuthority = url_1.parse(spSiteUrl).host;
        const resource = `${consts.SharePointServicePrincipal}/${spAuthority}@${authData.realm}`;
        const appId = `${oauth.clientId}@${authData.realm}`;
        const tokenService = url_1.parse(authData.securityTokenServiceUri);
        const tokenUrl = `${tokenService.protocol}//${tokenService.host}/${authData.realm}${tokenService.path}`;
        return config_1.request.post(tokenUrl, {
            form: {
                grant_type: 'refresh_token',
                client_id: appId,
                client_secret: oauth.clientSecret,
                refresh_token: authData.refreshToken,
                resource: resource
            }
        }).json()
            .then(data => {
            return {
                value: data.access_token,
                expireOn: new Date(parseInt(data.expires_on, 10))
            };
        });
    }
    static getAppOnlyAccessToken(spSiteUrl, authData, oauth) {
        const spAuthority = url_1.parse(spSiteUrl).host;
        const resource = `${consts.SharePointServicePrincipal}/${spAuthority}@${authData.realm}`;
        const appId = `${oauth.clientId}@${authData.realm}`;
        const tokenService = url_1.parse(authData.securityTokenServiceUri);
        const tokenUrl = `${tokenService.protocol}//${tokenService.host}/${authData.realm}${tokenService.path}`;
        return config_1.request.post(tokenUrl, {
            form: {
                grant_type: 'client_credentials',
                client_id: appId,
                client_secret: oauth.clientSecret,
                scope: resource,
                resource: resource
            }
        }).json()
            .then(data => {
            return {
                value: data.access_token,
                expireOn: new Date(parseInt(data.expires_on, 10))
            };
        });
    }
}
exports.TokenHelper = TokenHelper;
//# sourceMappingURL=TokenHelper.js.map