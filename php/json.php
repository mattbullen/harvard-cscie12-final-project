<?php

// Modified from: http://stackoverflow.com/questions/15870159/list-files-on-directory-and-print-result-as-json

$dir = "saved/";
$inner_array = array();
if(is_dir($dir)){
    if($dh = opendir($dir)) {
        while(($file = readdir($dh)) != false) {
            if($file == "." or $file == "..") {
				continue;
            } else {
				$url = 'http://bullen.io/cscie12/php/saved/' . $file;
                $inner_array[] = array('file'=>$file, 'url'=>$url);
            }
        }
    }
	$return_array = array('original'=>$inner_array);
	header('Content-Type: application/json');
    echo json_encode($return_array);
}

?>