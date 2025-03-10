"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = void 0;
const AuthResolverFactory_1 = require("./auth/AuthResolverFactory");
function getAuth(url, options) {
    return AuthResolverFactory_1.AuthResolverFactory.resolve(url, options).getAuth();
}
exports.getAuth = getAuth;
__exportStar(require("./auth/IAuthOptions"), exports);
__exportStar(require("./auth/IAuthResponse"), exports);
__exportStar(require("./utils/TokenHelper"), exports);
__exportStar(require("./auth/base"), exports);
var config_1 = require("./config");
Object.defineProperty(exports, "setup", { enumerable: true, get: function () { return config_1.setup; } });
//# sourceMappingURL=index.js.map