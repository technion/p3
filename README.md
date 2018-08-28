p3
=====

Web interface for remote reset of Active Directory passwords.

Written to address the mess of Microsoft licensing associated with remote users and password write-back, specifically Microsoft's P1 and P2 license.

Security Features
--------------
- [x] Single endpoint design with absolutely minimal attack surface
- [x] Custom nginx config with strict input rules per above
- [x] No stored Active Directory credentials, authorises against current user password only
- [x] Rate limiting on per username basis
- [x] Rate limiting on per IP basis
- [x] Critical AD accounts blacklisted from access
- [x] Ban bots (Google Recaptcha)
- [x] Whitelist validation of input fields
- [x] Static code analysis (utilising PEST)
- [x] Encryption forced in AD communication
- [ ] API success and fail logged in

Nginx Sample
------------
Example configuration implements the following:
- [x] Only single endpoint forwarded to backend
- [x] Limits access to POSt
- [x] Limits access to correct content type
- [x] Rate limits by IP address
- [x] Customises errors for friendly parsing by frontend (no HTML)
- [x] Standard security headers

Configuration
-------------
The file private.config should follow this format:
```
[
  {p3, [
      {captcha_key, <<"secret">},
      {domain_list, [ "ad.lolware.net", "prodpriv.lolware.net" ]},
      {server_list, ["127.0.0.1"] }
  ]}
].

```

Frontend
--------
Frontend is a React based UI.
The use of Google recaptcha was regrettably required, but no other Javascript or third party resources are utilised. The landing page is entirely self hosted.

Build dev

    npm run build

Build prod

    npm run prod
