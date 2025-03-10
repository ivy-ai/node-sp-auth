"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdfsHelper = void 0;
const config_1 = require("./../config");
const url = require("url");
const lodash = require('lodash');
const xmldoc = require('xmldoc');
const AdfsSamlWsfed_1 = require("./../templates/AdfsSamlWsfed");
class AdfsHelper {
    static getSamlAssertion(credentials) {
        const adfsHost = url.parse(credentials.adfsUrl).host;
        const usernameMixedUrl = `https://${adfsHost}/adfs/services/trust/13/usernamemixed`;
        const samlBody = lodash.template(AdfsSamlWsfed_1.template)({
            to: usernameMixedUrl,
            username: credentials.username,
            password: credentials.password,
            relyingParty: credentials.relyingParty
        });
        return config_1.request.post(usernameMixedUrl, {
            body: samlBody,
            resolveBodyOnly: true,
            headers: {
                'Content-Length': samlBody.length.toString(),
                'Content-Type': 'application/soap+xml; charset=utf-8'
            }
        })
            .then(xmlResponse => {
            const doc = new xmldoc.XmlDocument(xmlResponse);
            const tokenResponseCollection = doc.childNamed('s:Body').firstChild;
            if (tokenResponseCollection.name.indexOf('Fault') !== -1) {
                throw new Error(tokenResponseCollection.toString());
            }
            const responseNamespace = tokenResponseCollection.name.split(':')[0];
            const securityTokenResponse = doc.childNamed('s:Body').firstChild.firstChild;
            const samlAssertion = securityTokenResponse.childNamed(responseNamespace + ':RequestedSecurityToken').firstChild;
            const notBefore = samlAssertion.firstChild.attr['NotBefore'];
            const notAfter = samlAssertion.firstChild.attr['NotOnOrAfter'];
            return {
                value: samlAssertion.toString({ compressed: true }),
                notAfter: notAfter,
                notBefore: notBefore
            };
        });
    }
}
exports.AdfsHelper = AdfsHelper;
//# sourceMappingURL=AdfsHelper.js.map