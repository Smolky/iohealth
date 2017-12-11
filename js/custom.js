/**
 * DOM modifications
 */
$(document).ready (function () {

    // Catch DOM elements
    var body = $('body');
    var radio_buttons = $(".radio ");
    
    
    // Header
    body.toggleClass ('state-header-fullwidth', $('.reportrange').length > 0);


    // Update DOM for radio buttons
    radio_buttons.contents ().filter(function() {return this.nodeType === 3;}).wrap ("<span></span>");
    radio_buttons.find ("span:first-child").remove ();

    
    // Menu
    $('.navbar-toggle').click (function (e) {
        body.toggleClass ('state-menu');
    });
    
});