"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.request = void 0;
const got_1 = require("got");
const global_agent_1 = require("global-agent");
if (process.env['http_proxy'] || process.env['https_proxy']) {
    if (process.env['http_proxy']) {
        process.env.GLOBAL_AGENT_HTTP_PROXY = process.env['http_proxy'];
    }
    if (process.env['https_proxy']) {
        process.env.GLOBAL_AGENT_HTTPS_PROXY = process.env['https_proxy'];
    }
    global_agent_1.bootstrap();
}
exports.request = got_1.default.extend({ followRedirect: false, rejectUnauthorized: false, throwHttpErrors: false, retry: 0 });
function setup(config) {
    if (config.requestOptions) {
        exports.request = exports.request.extend(config.requestOptions);
    }
}
exports.setup = setup;
//# sourceMappingURL=config.js.map