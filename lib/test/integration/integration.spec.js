"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const got_1 = require("got");
const http = require("http");
const https = require("https");
const url = require("url");
require("mocha");
const spauth = require("./../../src/index");
const config_1 = require("./../../src/config");
const UrlHelper_1 = require("../../src/utils/UrlHelper");
const config = require('./config');
const tests = [
    {
        name: 'adfs user credentials',
        creds: config.adfsCredentials,
        url: config.onpremAdfsEnabledUrl
    },
    {
        name: 'on-premise user credentials',
        creds: config.onpremCreds,
        url: config.onpremNtlmEnabledUrl
    },
    {
        name: 'on-premise user UPN credentials',
        creds: config.onpremUpnCreds,
        url: config.onpremNtlmEnabledUrl
    },
    {
        name: 'on-premise user+domain credentials',
        creds: config.onpremUserWithDomainCreds,
        url: config.onpremNtlmEnabledUrl
    },
    {
        name: 'online user credentials',
        creds: config.onlineCreds,
        url: config.onlineUrl
    },
    {
        name: 'on-premise addin only',
        creds: config.onpremAddinOnly,
        url: config.onpremAdfsEnabledUrl
    },
    {
        name: 'online addin only',
        creds: config.onlineAddinOnly,
        url: config.onlineUrl
    },
    {
        name: 'ondemand - online',
        creds: {
            ondemand: true
        },
        url: config.onlineUrl
    },
    {
        name: 'ondemand - on-premise with ADFS',
        creds: {
            ondemand: true
        },
        url: config.onpremAdfsEnabledUrl
    },
    {
        name: 'file creds - online',
        creds: null,
        url: config.onlineUrl
    },
    {
        name: 'file creds - on-premise - NTLM',
        creds: null,
        url: config.onpremNtlmEnabledUrl
    },
    {
        name: 'file creds - on-premise - ADFS',
        creds: null,
        url: config.onpremAdfsEnabledUrl
    }
];
tests.forEach(test => {
    test.url = UrlHelper_1.UrlHelper.removeTrailingSlash(test.url);
    describe(`node-sp-auth: integration - ${test.name}`, () => {
        it('should get list title with core http(s)', function (done) {
            this.timeout(90 * 1000);
            const parsedUrl = url.parse(test.url);
            const documentTitle = 'Documents';
            const isHttps = parsedUrl.protocol === 'https:';
            const send = isHttps ? https.request : http.request;
            let agent = isHttps ? new https.Agent({ rejectUnauthorized: false }) :
                new http.Agent();
            spauth.getAuth(test.url, test.creds)
                .then(response => {
                const options = getDefaultHeaders();
                const headers = Object.assign(options.headers, response.headers);
                if (response.options && response.options['agent']) {
                    agent = response.options['agent'];
                }
                send({
                    host: parsedUrl.host,
                    hostname: parsedUrl.hostname,
                    port: parseInt(parsedUrl.port, 10),
                    protocol: parsedUrl.protocol,
                    path: `${parsedUrl.path}/_api/web/lists/getbytitle('${documentTitle}')`,
                    method: 'GET',
                    headers: headers,
                    agent: agent
                }, clientRequest => {
                    let results = '';
                    clientRequest.on('data', chunk => {
                        results += chunk;
                    });
                    clientRequest.on('error', () => {
                        done(new Error('Unexpected error during http(s) request'));
                    });
                    clientRequest.on('end', () => {
                        const data = JSON.parse(results);
                        chai_1.expect(data.d.Title).to.equal(documentTitle);
                        done();
                    });
                }).end();
            })
                .catch(done);
        });
        it('should get list title', function (done) {
            this.timeout(90 * 1000);
            const documentTitle = 'Documents';
            spauth.getAuth(test.url, test.creds)
                .then(response => {
                const options = getDefaultHeaders();
                Object.assign(options.headers, response.headers);
                Object.assign(options, response.options);
                options.url = `${test.url}/_api/web/lists/getbytitle('${documentTitle}')`;
                return got_1.default.get(options).json();
            })
                .then(data => {
                chai_1.expect(data.d.Title).to.equal(documentTitle);
                done();
            })
                .catch(done);
        });
        it('should get Title field', function (done) {
            this.timeout(90 * 1000);
            const fieldTitle = 'Title';
            spauth.getAuth(test.url, test.creds)
                .then(response => {
                const options = getDefaultHeaders();
                Object.assign(options.headers, response.headers);
                Object.assign(options, response.options);
                options.url = `${test.url}/_api/web/fields/getbytitle('${fieldTitle}')`;
                return got_1.default(options).json();
            })
                .then(data => {
                chai_1.expect(data.d.Title).to.equal(fieldTitle);
                done();
            })
                .catch(done);
        });
        it('should throw 500 error', function (done) {
            this.timeout(90 * 1000);
            spauth.getAuth(test.url, test.creds)
                .then(response => {
                const options = getDefaultHeaders();
                Object.assign(options.headers, response.headers);
                Object.assign(options, response.options);
                const path = UrlHelper_1.UrlHelper.trimSlashes(url.parse(test.url).path);
                options.url = `${test.url}/_api/web/GetFileByServerRelativeUrl(@FileUrl)?@FileUrl='/${path}/SiteAssets/${encodeURIComponent('undefined.txt')}'`;
                options.retry = 0;
                return got_1.default.get(options);
            })
                .then(() => {
                done(new Error('Should throw'));
            })
                .catch(err => {
                if (err.message.indexOf('500') !== -1 || err.message.indexOf('404') !== -1) {
                    done();
                }
                else {
                    done(err);
                }
            });
        });
        it('should not setup custom options for request', function (done) {
            spauth.setup({
                requestOptions: {
                    headers: {}
                }
            });
            config_1.request.get('http://google.com')
                .then(result => {
                chai_1.expect(result.headers['my-test-header']).equals(undefined);
                done();
            })
                .catch(done);
        });
        it('should setup custom options for request', function (done) {
            spauth.setup({
                requestOptions: {
                    headers: {
                        'my-test-header': 'my value'
                    }
                }
            });
            config_1.request.get('http://google.com')
                .then(result => {
                chai_1.expect(result.request.options.headers['my-test-header']).equals('my value');
                done();
            })
                .catch(done);
        });
    });
});
function getDefaultHeaders() {
    const options = {
        responseType: 'json',
        headers: {
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose'
        },
        rejectUnauthorized: false
    };
    return options;
}
//# sourceMappingURL=integration.spec.js.map