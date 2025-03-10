"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesHelper = void 0;
const path = require("path");
const fs = require("fs");
const UrlHelper_1 = require("./UrlHelper");
class FilesHelper {
    static getUserDataFolder() {
        const platform = process.platform;
        let homepath;
        if (platform.lastIndexOf('win') === 0) {
            homepath = process.env.APPDATA || process.env.LOCALAPPDATA;
        }
        if (platform === 'darwin') {
            homepath = process.env.HOME;
            homepath = path.join(homepath, 'Library', 'Preferences');
        }
        if (platform === 'linux') {
            homepath = process.env.HOME;
        }
        if (!homepath) {
            throw new Error('Couldn\'t find the base application data folder');
        }
        const dataPath = path.join(homepath, 'spauth');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }
        return dataPath;
    }
    static resolveFileName(siteUrl) {
        const url = FilesHelper.resolveSiteUrl(siteUrl);
        return url.replace(/[:/\s]/g, '_');
    }
    static resolveSiteUrl(siteUrl) {
        if (siteUrl.indexOf('/_') === -1 && siteUrl.indexOf('/vti_') === -1) {
            return UrlHelper_1.UrlHelper.removeTrailingSlash(siteUrl);
        }
        if (siteUrl.indexOf('/_') !== -1) {
            return siteUrl.slice(0, siteUrl.indexOf('/_'));
        }
        if (siteUrl.indexOf('/vti_') !== -1) {
            return siteUrl.slice(0, siteUrl.indexOf('/vti_'));
        }
        throw new Error('Unable to resolve web site url from full request url');
    }
}
exports.FilesHelper = FilesHelper;
//# sourceMappingURL=FilesHelper.js.map