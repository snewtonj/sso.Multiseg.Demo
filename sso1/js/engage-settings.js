(function() {
    if (typeof window.janrain !== 'object') window.janrain = {};
    if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
    
    janrain.settings.type = 'modal';
    janrain.settings.tokenAction = 'event';
    janrain.settings.providers = ['googleplus', 'twitter','facebook'];
    janrain.settings.appId = 'your app id';
    janrain.settings.appUrl = 'https://yourapp.rpxnow.com';
    janrain.settings.actionText = 'Multi-Segment Engage Test Login';
    janrain.settings.tokenUrl = 'http://sso1.janrain.com/cgi-bin/profile';
    janrain.settings.ssoServer = 'https://yourapp.janrainsso.com';

    function isReady() { janrain.ready = true; };
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", isReady, false);
    } else {
      window.attachEvent('onload', isReady);
    }

    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.id = 'janrainAuthWidget';

    if (document.location.protocol === 'https:') {
      e.src = 'https://rpxnow.com/js/lib/yourapp/engage.js';
    } else {
      e.src = 'http://widget-cdn.rpxnow.com/js/lib/yourapp/engage.js';
    }

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
})();

function janrainWidgetOnload() {
  janrain.events.onProviderLoginToken.addHandler(function(response) {
    janrain.engage.signin.modal.close();
    $.ajax({
       url: janrain.settings.tokenURL+"?token="+response.token,
       dataType: 'json',
       error: function(evt, txtStatus, err) {
        console.log(evt);
       },
       success: function(data){
          //alert("received a response!" + data);
          user = data.profile.name.formatted;
          createCookie('user', user);
          showProfile();
       }
    });
  });
}

function showProfile() {
  var tokenData = decodeURIComponent(readCookie('cmProfile'));
  if (tokenData !== 'null') {
    tokenObject = JSON.parse(tokenData);
    user = tokenObject.profile.name.formatted.replace(/\+/g, ' ');
    setLogout(user);
    var ppTable = prettyPrint(tokenObject, { expanded: false, styles: { object: { th: { backgroundColor: 'rgb(73,38,25)' }}}});
    window.ppTable = document.getElementById('cmProfile').appendChild(ppTable);
    return false;
  }
}
function setLogout(name) {
  if (name != null) {
      document.getElementById('sign-out').innerHTML = 'Sign Out' + ' ' + name;
      document.getElementById('sign-out').href = "#";
  } else {
      eraseCookie('cmProfile');
      window.ppTable.parentNode.firstChild.remove();
      document.getElementById('sign-out').innerHTML = '';
  }
}

function my_logout() {
  eraseCookie('cmDisplayName');
  JANRAIN.SSO.ENGAGE.logout({
      sso_server: janrain.settings.ssoServer,
  }, setLogout);
  console.log("Logout done");
};
