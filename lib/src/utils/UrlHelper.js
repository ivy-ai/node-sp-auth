"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlHelper = void 0;
const url = require("url");
const HostingEnvironment_1 = require("../auth/HostingEnvironment");
class UrlHelper {
    static removeTrailingSlash(url) {
        return url.replace(/(\/$)|(\\$)/, '');
    }
    static removeLeadingSlash(url) {
        return url.replace(/(^\/)|(^\\)/, '');
    }
    static trimSlashes(url) {
        return url.replace(/(^\/)|(^\\)|(\/$)|(\\$)/g, '');
    }
    static ResolveHostingEnvironment(siteUrl) {
        const host = (url.parse(siteUrl)).host;
        if (host.indexOf('.sharepoint.com') !== -1) {
            return HostingEnvironment_1.HostingEnvironment.Production;
        }
        else if (host.indexOf('.sharepoint.cn') !== -1) {
            return HostingEnvironment_1.HostingEnvironment.China;
        }
        else if (host.indexOf('.sharepoint.de') !== -1) {
            return HostingEnvironment_1.HostingEnvironment.German;
        }
        else if (host.indexOf('.sharepoint-mil.us') !== -1) {
            return HostingEnvironment_1.HostingEnvironment.USDefence;
        }
        else if (host.indexOf('.sharepoint.us') !== -1) {
            return HostingEnvironment_1.HostingEnvironment.USGovernment;
        }
        return HostingEnvironment_1.HostingEnvironment.Production;
    }
}
exports.UrlHelper = UrlHelper;
//# sourceMappingURL=UrlHelper.js.map