/**
 * DOM modifications
 */
$(document).ready (function () {

    // Catch DOM elements
    var body = $('body');
    var radio_buttons = $(".radio ");
    var menu = $('.main-menu');
    var profile_menu_items = $('.dropdown-menu').eq (1).find ('li');
    var sidebar = $('#sidebar-left');
    
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
    if ($('form[action$="auth/signup"]').length == 1) {
        $('.cr-navbar').remove ();
    }


    // Update DOM for radio buttons
    radio_buttons.contents ().filter(function() {return this.nodeType === 3;}).wrap ("<span></span>");
    radio_buttons.find ("span:first-child").remove ();

    
    // Menu
    $('.navbar-toggle').unbind ().click (function (e) {
        body.toggleClass ('state-menu');
    });
    
});