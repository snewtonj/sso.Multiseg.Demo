*This is sample code is unsupported: use at your own risk*

Multi-Segment SSO Demonstration README
======================================

Some text is taken from [Engage SSO Integration](http://developers.janrain.com/documentation/federate/engage_sso_integration/ "Engage SSO Integration")
Site Setup
---------
By default the sites are sso1.janrain.com through sso4.janrain.com.
Adjust the names in the html and javascript if those change. Running
virtual servers on a VM and using a local modified /etc/hosts file
for the particular setup. Each of the for sso? directories should
be a different virtual server. The virtual hosts don't need to be
externally visible, but they must be able to communicate with
the Engage server and CDN.

Configuration
-------------

### Per Site ###
Each site has an index.html file where the per site settings exist
    janrain.settings.segment = 'segmentName';
Segment names are restricted to ASCII upper and lower case, numbers, and the underscore (_)
    janrain.settings.supportedSegments = 'supportedSegmentOne-supportedSegmentTwo';
Supported segment names are joined by the dash (-)


```JavaScript
JANRAIN.SSO.ENGAGE.check_login ({
  sso_server: janrain.settings.ssoServer,
  // each side much have an its own xd receiver
  xd_receiver: 'http://sso4.janrain.com/rpx_xdcomm.html',
  // each site should have a logout script that will close the session and release any resources in use
  logout_uri: 'http://sso4.janrain.com/cgi-bin/logout',
  // the usual token url
  token_uri: '/cgi-bin/token',
  // from the settings above
  segment: janrain.settings.segment,
  supported_segments: janrain.settings.supportedSegments
});
```

### Global Settings ###

The global engage and sso setting existing in the engage-settings.js
file, and this by default is served out of sso1 but can be changed.
Depending on how your engage application is configured, the contents
of this file might be different, but it needs at a minimum the
following settings:

```JavaScript
janrain.settings.appId = 'your app id';
janrain.settings.appUrl = 'https://yourapp.rpxnow.com';
janrain.settings.ssoServer = 'https://yourapp.janrainsso.com';

if (document.location.protocol === 'https:') {
  e.src = 'https://rpxnow.com/js/lib/yourapp/engage.js';
} else {
  e.src = 'http://widget-cdn.rpxnow.com/js/lib/yourapp/engage.js';
}
```

Libraries
--------
Two utlity libraries are provided in the sso1/js directoy. The
cookie.js file is required to handle cookies in the browser, while
the prettyprint.js file is used to display the logged-in user profile
as a table.

CGI Scripts
----------
In the cgi-bin directory are example Ruby scripts for token, profile,
and logout functions.  Recent ruby versions should include all the
required libraries, but some might not have the json library.
