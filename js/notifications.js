/**
 * DOM modifications
 */
$(document).ready (function () {

    /** var body DOM */
    var body = $('body');
       
    
    /** var notifications DOM */
    var notifications = $('#notifications');
    
    
    /** var notifications_handler DOM */
    var notifications_handler = $('#notifications-handler');
    
    
    
    /** var device_token StringThe token of the device for the push notifications */
    var device_token = body.attr ('data-token');
    alert ('token: ' + device_token);
    
    
    /** var url String The URL for the API calls */
    var url = body.attr ('data-url');
    // alert ('url: ' + url);
    
    
    /** var patient_id int The patient ID @todo review */
    var patient_id = $('#select-person').val () * 1;
    // alert ('patient: ' + patient_id);
    
    
    // Update the changes
    notifications_handler.unbind ().change (function () {
    
        /** var api_url String The API URL to subscribe your device */
        var api_url = url + '/subscribe_to_push';
        
        
        // Testing
        alert ('@test-notifications ' + api_url);

        
        
        /** var data Object */
        var data = {
            patient_id: patient_id,
            device_token: device_token
        };
        
        
        // Prepare POST request
        $.ajax ({
            url: api_url,
            data: data,
            dataType: 'json',
            method: 'post',
            success: function (response) {
            
                // No response
                if ( ! response || response.ok == false) {
                    alert ('La operación no se puede completar. Por favor, inténtelo en unos instantes y vuelva a intentarlo. Si el problema persiste, póngase en contacto con el administrador');
                    return;
                }
                
                
                // Force the checkbox status
                notifications_handler.prop ('checked', response.checked);
            
            },
            error: function () {
                // @todo
            }
        });
    
    });
    
    
    // If user has a token, then show the notifications
    // event
    if (device_token) {
        notifications.show ();
    }
    

    
    
});