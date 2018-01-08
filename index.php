<?php 

/* 
 * Proxy IOHealth to develop a custom CSS for Phonegap
 *
 */
 
// Config error display
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Init vars
$base_url = '/css-healthio/';
$page = str_replace ($base_url, '', $_SERVER['REQUEST_URI']);


// To proxy authentication
$cookies = "remember_82e5d2c56bdd0811318f0cf078b78bfc=eyJpdiI6IkxERHRzdU5wZ0pmWlFJekhWVGwxWkE9PSIsInZhbHVlIjoiaVBcL3BIUThZQUtQeWNBemVzY2ZiMDJidXJKQ1picHBjRzN4d25PWVE5eGRQWlN6TjhORlljZmFBRTd6RFpJVjlKOFpFMVVLdlI3QU1MTW1yNDdxVVdLRlVjQU80UFwvdFhSOWpvYVpiZzY5az0iLCJtYWMiOiI3N2Y3ZmVhNTk5OTAyNGU1OWVhZWEwZGJjMzA1M2UwMzE1ZmVkZmQ5M2NlNTQ0Nzc0ZjRlNmJmNWI1YTE1MTBiIn0%3D";


// What to load?
$url = '';
switch ($page) {
    case '':
    case 'auth';
    case 'login';
        $cookies = '';
        $url = '';
        break;
    
    case 'auth/signup':
    case 'signup':
        $cookies = '';
        $url = 'auth/signup';
        break;
    
    default:
        $url = $page;
        break;

}


// Get request URI
$parts = explode ('/', $page);
$parts = explode ('?', $parts[0]);


// Prepare headers
$headers = [];
$headers[] = "Cookie: " . $cookies;
if (isset ($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    $headers[] = "X-Requested-With: XMLHttpRequest";
}


// Fetch curl request
$ch = curl_init ();
curl_setopt ($ch, CURLOPT_URL, "http://iohealth.nimbeo.com/" . $url);
curl_setopt ($ch, CURLOPT_HEADER, false);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt ($ch, CURLOPT_HTTPHEADER, $headers);


// Fetch curl response
$content = curl_exec ($ch);
$content_type = curl_getinfo ($ch, CURLINFO_CONTENT_TYPE);
curl_close ($ch);



// If the query was to the API, we are going to return a JSON response
if ($content_type != 'text/html; charset=UTF-8') {
    header ("Content-Type: application/json");
    echo $content;
    die ();
}


$content = str_replace (
    "ajax: 'http://iohealth.nimbeo.com/report/table?mode=all' + template_filter,", 
    "ajax: '" . $base_url . "report/table?mode=all' + template_filter,",  
    $content
);

$content = str_replace (
    'var $SITE_PATH = "http://iohealth.nimbeo.com/"', 
    'var $SITE_PATH = "http://155.54.205.81/css-healthio/"', 
    $content
);


// If not, return the parsed HTML
// Create DOM tree
$dom = new DOMDocument;
@$dom->loadHTML ($content);


// Change anchor to simulate local navigation
foreach ($dom->getElementsByTagName('a') as $anchor) {

    // Skip garbage
    if (strpos ($anchor->getAttribute ('href'), 'javascript') === 0) {
        continue;
    }
    
    if ($anchor->getAttribute ('href') == '#') {
        continue;
    }
    
    
    // Canonical
    if ($anchor->getAttribute ('href') == 'http://iohealth.nimbeo.com') {
        $anchor->setAttribute ('href',  $base_url);
        continue;
    }
    
    
    // The rest of cases, convert urls to local
    $anchor->setAttribute ('href',  $base_url . str_replace ('http://iohealth.nimbeo.com/', '', $anchor->getAttribute ('href')) );
}


// Inject extra CSS
$css = file_get_contents ("css/custom.css"); 
$new_elm = $dom->createElement('style', $css);
$elm_type_attr = $dom->createAttribute('type');
$elm_type_attr->value = 'text/css';    
foreach ($dom->getElementsByTagName('head') as $head) {
    $head->appendChild ($new_elm);
}


// Inject extra JS
$js = file_get_contents ("js/custom.js"); 
$new_elm = $dom->createElement('script', $js);
foreach ($dom->getElementsByTagName('body') as $body) {
    $body->appendChild ($new_elm);
}


// Output parsed HTML
echo $dom->saveHTML();    
?>