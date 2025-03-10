"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOndemandCredentials = exports.isAdfsCredentials = exports.isFbaCredentialsOnpremise = exports.isTmgCredentialsOnpremise = exports.isUserCredentialsOnpremise = exports.isUserCredentialsOnline = exports.isAddinOnlyOnpremise = exports.isAddinOnlyOnline = exports.isOnPremUrl = void 0;
const url = require("url");
function isOnPremUrl(siteUrl) {
    const host = (url.parse(siteUrl)).host;
    return host.indexOf('.sharepoint.com') === -1 && host.indexOf('.sharepoint.cn') === -1 && host.indexOf('.sharepoint.de') === -1
        && host.indexOf('.sharepoint-mil.us') === -1 && host.indexOf('.sharepoint.us') === -1;
}
exports.isOnPremUrl = isOnPremUrl;
function isAddinOnlyOnline(T) {
    return T.clientSecret !== undefined;
}
exports.isAddinOnlyOnline = isAddinOnlyOnline;
function isAddinOnlyOnpremise(T) {
    return T.shaThumbprint !== undefined;
}
exports.isAddinOnlyOnpremise = isAddinOnlyOnpremise;
function isUserCredentialsOnline(siteUrl, T) {
    if (T.online) {
        return true;
    }
    const isOnPrem = isOnPremUrl(siteUrl);
    if (!isOnPrem && T.username !== undefined && !isAdfsCredentials(T)) {
        return true;
    }
    return false;
}
exports.isUserCredentialsOnline = isUserCredentialsOnline;
function isUserCredentialsOnpremise(siteUrl, T) {
    if (T.online) {
        return false;
    }
    const isOnPrem = isOnPremUrl(siteUrl);
    if (isOnPrem && T.username !== undefined && !isAdfsCredentials(T)) {
        return true;
    }
    return false;
}
exports.isUserCredentialsOnpremise = isUserCredentialsOnpremise;
function isTmgCredentialsOnpremise(siteUrl, T) {
    const isOnPrem = isOnPremUrl(siteUrl);
    if (isOnPrem && T.username !== undefined && T.tmg) {
        return true;
    }
    return false;
}
exports.isTmgCredentialsOnpremise = isTmgCredentialsOnpremise;
function isFbaCredentialsOnpremise(siteUrl, T) {
    const isOnPrem = isOnPremUrl(siteUrl);
    if (isOnPrem && T.username !== undefined && T.fba) {
        return true;
    }
    return false;
}
exports.isFbaCredentialsOnpremise = isFbaCredentialsOnpremise;
function isAdfsCredentials(T) {
    return T.adfsUrl !== undefined;
}
exports.isAdfsCredentials = isAdfsCredentials;
function isOndemandCredentials(T) {
    return T.ondemand !== undefined;
}
exports.isOndemandCredentials = isOndemandCredentials;
//# sourceMappingURL=IAuthOptions.js.map