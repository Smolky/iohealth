/**
 * IOHealth App Bootstrap
 *
 * This is used to create the emded app in Cordova for IOHealth
 *
 * It handles:
 * - The WebApp
 * - The offline mode
 * - Push notifications
 * - Custom CSS and custom Javascript
 * 
 *
 * @package IOHealth
 */

/* body DOM element */
var body;


/* @var ref cordova.InAppBrowser The reference to the browser */
var ref;


/* @var url String The URL of the web site */
/* @todo Update to https */
var url = "http://iohealth.nimbeo.com/health";


/* @var loaded Boolean Tells wheter the page has been loaded or not */
var loaded = false;


/* @var options String Options for the webview
 * @link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/ 
 */
var options="location=no,hidden=yes,clearcache=yes,toolbar=no,zoom=no,hardwareback=true,useWideViewPort=yes";


/* @var js_loaded Boolean */
var js_loaded = false;


/* @var css_loaded Boolean */
var css_loaded = false;


/* @var page_changing Boolean */
var page_changing = false;


/**
 * onLoad
 *
 * Wait for device API libraries to load
 */
function onLoad () {
    
    // Fetch body
    body = $('body');

    
    // Attach Cordova device ready event 
    document.addEventListener ("deviceready", onDeviceReady, false);
    
    
    // Attach offline event. 
    // Each time the app goes offline it will show an error
    // waiting for connection
    document.addEventListener ("offline", function () {
    
        // The page was loaded, so unload the browser
        if (loaded) {
            ref.close ();
            ref = undefined;
            loaded = false;
        }
        
        body.addClass ('error-state');
        
    }, false);
    
    
    // Attach online event. Load again from scratch
    document.addEventListener ("online", function () {
    
        if ( ! loaded) {
            loadPage ();
        }
    
        body.removeClass ('error-state');
        
    }, false);
    
}


/**
 * show_webview
 *
 * shoss the page when js and css are loaded
 */
var show_webview = function () {
    
    // If the scripts are not loaded, then do nothing yet.
    if ( ! (css_loaded && js_loaded)) {
        return;
    }
        
    // Show
    ref.show ();
    
    
    // Stop loading
    body.removeClass ('loading-state');


    // Set to loaded
    loaded = true;
            
}


/**
 * loadPage
 *
 */
function loadPage () {
    
    // Bind the webview
    ref = cordova.InAppBrowser.open (url, "_self", options);
    
    
    // Attach load error event
    ref.addEventListener ('loaderror', loadErrorCallBack);
    
    
    // Attach load start event. It will be fire when a page changes.
    ref.addEventListener ('loadstart', function () {
        page_changing = true;
        body.addClass ('loading-state');
        ref.hide ();
    });
    
    
    // Attach exit event
    ref.addEventListener ('exit', function () {
    
        // Has the user exit manually?
        if (loaded) {
            navigator.app.exitApp ();
        }
    });
    
    
    // Attach load stop event
    ref.addEventListener ('loadstop', function () { 
    
        // Avoid load twice
        if ( ! page_changing) {
            return;
        }
    
    
        // Attach the API URL
        ref.executeScript ({
            code: "$('body').attr ('data-url', '" + url + "');"
        });
        
        
        // When the application is ready, we can handle the push 
        // notifications
        // Get the notification token
        FCMPlugin.getToken (function (token) {
           
            // Attach the device ID
            ref.executeScript ({
                code: "$('body').attr ('data-token', '" + token + "');"
            });
            
            
            // Insert cumstom JS to the application
            $.get ('js/notifications.js', function (js) {
                ref.executeScript ({
                    code: js
                });
            });
        });
        
        
        // Subscribe to the reminders category
        FCMPlugin.subscribeToTopic ('reminders');
    
        
        // A notification was received
        FCMPlugin.onNotification (function(data){
            if (data.wasTapped){
                console.log (JSON.stringify(data));
            } else {
                console.log (JSON.stringify(data));
            }
        });                
        
        
        // Inject code to add a class to indicate the content
        // has been loaded whitin some kind of iframe
        
        
        $.get ('css/custom.css', function (css) {
            ref.insertCSS ({
                code: css
            });
            css_loaded = true;
            show_webview ();
        })
        
        
        // Insert cumstom JS to the application
        $.get ('js/custom.js', function (js) {
            ref.executeScript ({
                code: js
            });
            js_loaded = true;
            show_webview ();
        });
        
        
        // Finish
        page_changing = false;
        
    });
}


// Handle error
function loadErrorCallBack () {
    body.removeClass ('loading-state');
    body.addClass ('error-state');
}


// device APIs are available
function onDeviceReady () {

    // Bind DOM events
    $('.reload-action').click (function (e) {
        location.reload (); 
    });
    
    $('.exit-action').click (function (e) {
        navigator.app.exitApp ();
    });
    

    // Check connection
    if (navigator.connection.type === Connection.NONE) {
        loadErrorCallBack ();
        return;
    } else {
        loadPage ();

    }

}
