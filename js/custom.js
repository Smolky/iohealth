/**
 * DOM modifications
 */
$(document).ready (function () {

    // Catch DOM elements
    var body = $('body');
    var menu = $('.main-menu');
    var profile_menu_items = $('.dropdown-menu').eq (1).find ('li');
    var sidebar = $('#sidebar-left');
    
    
    // Remove garbage
    $('.navbar-brand').removeAttr ('style');
    
    
    // Wrapp tables
    $('#dataTable_wrapper').find ('table').wrap('<div class="table-scrollbar"></div>')
    
    
    
    // Remove unwainting things of the footer
    sidebar.find ('footer p:first-child').remove ();
    sidebar.find ('footer').eq (1).remove ();
    
    
    
    // Change anchor to be inside list items
    sidebar.find ('footer p a').each (function () {
        $(this).wrap ('<li></li>');
    });
    
    
    // Attach to the menu
    menu.append (profile_menu_items.clone ());
    menu.append (sidebar.find ('footer li').addClass ('company').clone ());
    
    
    // Remove left garbage
    profile_menu_items.remove ().parent().remove ();
    $('#sidebar-left footer').remove ();
    menu.find ('hr').remove ();
    menu.find ('li:empty').remove ();
    

    // Header
    body.toggleClass ('state-header-fullwidth', $('.reportrange').length > 0);


    // Update DOM for radio buttons
    function update_radio_buttons (wrapper) {
        var radio_buttons = wrapper.find (".radio");
        radio_buttons.contents ().filter (function() {return this.nodeType === 3;}).wrap ("<span></span>");
        radio_buttons.find ("span:first-child").remove ();
    
    }
    
    update_radio_buttons (body);
    setInterval (function () {
        update_radio_buttons ($(".insert-template"));
    }, 300);


    
    // Menu
    $('.navbar-toggle').click (function (e) {
        body.toggleClass ('state-menu');
    });
    
    
});