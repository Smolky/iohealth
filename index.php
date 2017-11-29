<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$page = isset ($_GET['page']) ? $_GET['page'] : 'login';

$url = '';
switch ($page) {
    case 'login';
        $url = '';
        break;
        
    case 'signup':
        $url = 'auth/signup';
        break;
        
    case 'contact':
        $url = 'contact';
        break;
        
    case 'report':
        $url = 'report';
        break;

}


$content = file_get_contents ("http://iohealth.nimbeo.com/" . $url); 
$css = file_get_contents ("css/custom.css"); 

$dom = new DOMDocument;
@$dom->loadHTML ($content);

$new_elm = $dom->createElement('style', $css);
$elm_type_attr = $dom->createAttribute('type');
$elm_type_attr->value = 'text/css';    

foreach ($dom->getElementsByTagName('head') as $head) {
    $head->appendChild ($new_elm);
}

echo $dom->saveHTML();    
?>