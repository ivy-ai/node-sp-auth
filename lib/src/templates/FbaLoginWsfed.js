"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
exports.template = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <Login xmlns="http://schemas.microsoft.com/sharepoint/soap/">
        <username><%= username %></username>
        <password><%= password %></password>
      </Login>
    </soap:Body>
  </soap:Envelope>
`;
//# sourceMappingURL=FbaLoginWsfed.js.map