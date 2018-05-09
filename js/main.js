/* body DOM element */
var body;


/* @var ref cordova.InAppBrowser The reference to the browser */
var ref;


/* @var url String */
var url = "http://iohealth.nimbeo.com/";


/* @var loaded Boolean Tells wheter the page has been loaded or not */
var loaded = false;


/* @var options String @link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/ */
var options="location=no,hidden=yes,clearcache=yes,toolbar=no,zoom=no,hardwareback=true,useWideViewPort=yes";


// Wait for device API libraries to load
function onLoad () {
    
    // Fetch body
    body = $('body');

    
    // Check
    body.addClass ('loading-state');
    document.addEventListener ("deviceready", onDeviceReady, false);
    
    
    // Offline and online events
    document.addEventListener ("offline", function () {
    
        // The page is loaded. Unload the browser, back to us
        if (loaded) {
            ref.close ();
            ref = undefined;
            loaded = false;
        }
        
        body.addClass ('error-state');
        
    }, false);
    
    
    document.addEventListener ("online", function () {
    
        if ( ! loaded) {
            loadPage ();
        }
    
        body.removeClass ('error-state');
    }, false);
    
}


// Load WebPage
function loadPage () {
    
    alert (url);
    
    // Open
    ref = cordova.InAppBrowser.open (url, "_self", options);
    
    
    // Register events
    // Errors
    ref.addEventListener ('loaderror', loadErrorCallBack);
    
    
    // Stop
    ref.addEventListener ('loadstop', function () { 
        
        // Set to loaded
        loaded = true;
        
        
        // Inject code to add a class to indicate the content
        // has been loaded whitin some kind of iframe
        ref.executeScript ({code: "(function() { document.getElementsByTagName ('body')[0].className = document.getElementsByTagName ('body')[0].className.concat (' state-iframe') })()"});
        
        
        // Show browser
        ref.show ();
    });
    
    
    // Exit application
    ref.addEventListener ('exit', function () {
    
        // Has the user exit manually?
        if (loaded) {
            navigator.app.exitApp ();
        }
    });
    
    
    // Bind DOM events
    $('.reload-action').click (function (e) {
        location.reload (); 
    });
    
    $('.exit-action').click (function (e) {
        navigator.app.exitApp ();
    });
    

}


// Handle error
function loadErrorCallBack () {
    body.removeClass ('loading-state');
    body.addClass ('error-state');
}


// device APIs are available
function onDeviceReady () {

    alert ('device-ready');

    // Check connection
    if (navigator.connection.type === Connection.NONE) {
        alert ('@test');
        loadErrorCallBack ();
        return;
    } else {
        loadPage ();

    }
}