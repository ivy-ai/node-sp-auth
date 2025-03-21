"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolverFactory = void 0;
const OnpremiseFbaCredentials_1 = require("./resolvers/OnpremiseFbaCredentials");
const OnpremiseTmgCredentials_1 = require("./resolvers/OnpremiseTmgCredentials");
const OnpremiseUserCredentials_1 = require("./resolvers/OnpremiseUserCredentials");
const OnlineUserCredentials_1 = require("./resolvers/OnlineUserCredentials");
const OnlineAddinOnly_1 = require("./resolvers/OnlineAddinOnly");
const OnpremiseAddinOnly_1 = require("./resolvers/OnpremiseAddinOnly");
const AdfsCredentials_1 = require("./resolvers/AdfsCredentials");
const OnDemand_1 = require("./resolvers/OnDemand/OnDemand");
const authOptions = require("./IAuthOptions");
class AuthResolverFactory {
    static resolve(siteUrl, options) {
        if (!options) {
            throw new Error('Please provide config!');
        }
        if (authOptions.isTmgCredentialsOnpremise(siteUrl, options)) {
            return new OnpremiseTmgCredentials_1.OnpremiseTmgCredentials(siteUrl, options);
        }
        if (authOptions.isFbaCredentialsOnpremise(siteUrl, options)) {
            return new OnpremiseFbaCredentials_1.OnpremiseFbaCredentials(siteUrl, options);
        }
        if (authOptions.isUserCredentialsOnpremise(siteUrl, options)) {
            return new OnpremiseUserCredentials_1.OnpremiseUserCredentials(siteUrl, options);
        }
        if (authOptions.isUserCredentialsOnline(siteUrl, options)) {
            return new OnlineUserCredentials_1.OnlineUserCredentials(siteUrl, options);
        }
        if (authOptions.isAddinOnlyOnline(options)) {
            return new OnlineAddinOnly_1.OnlineAddinOnly(siteUrl, options);
        }
        if (authOptions.isAddinOnlyOnpremise(options)) {
            return new OnpremiseAddinOnly_1.OnpremiseAddinOnly(siteUrl, options);
        }
        if (authOptions.isAdfsCredentials(options)) {
            return new AdfsCredentials_1.AdfsCredentials(siteUrl, options);
        }
        if (authOptions.isOndemandCredentials(options)) {
            return new OnDemand_1.OnDemand(siteUrl, options);
        }
        throw new Error('Error while resolving authentication class');
    }
}
exports.AuthResolverFactory = AuthResolverFactory;
//# sourceMappingURL=AuthResolverFactory.js.map