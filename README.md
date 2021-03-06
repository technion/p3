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
- [x] IP reputational lookup, banning proxy and Tor endpoints
- [x] Static code analysis (utilising PEST)
- [x] Encryption forced in AD communication
- [x] Passwords checked with Pwned Passwords API for compromised
- [ ] API success and fail logged in

Nginx Sample
------------
Example configuration implements the following:
- [x] Only single endpoint forwarded to backend
- [x] Limits access to POST
- [x] Limits access to correct content type
- [x] Rate limits by IP address
- [x] Customises errors for friendly parsing by frontend (no HTML)
- [x] Standard security headers

Third Party
-----------

The following API keys are required to utilise this tool:
- [Google Recaptcha](https://developers.google.com/recaptcha/intro)
- [IPHub](https://iphub.info/)

Configuration
-------------
The file private.config should follow this format:
```
[
  {p3, [
      {captcha_key, <<"captcha">>},
      {domain_list, [ "domain1.lolware.net", "domain2.lolware.net" ]},
      {server_list, ["127.0.0.1"] },
      {iphub_key, <<"key">> }
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
