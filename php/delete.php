<?php  

// Modified from: http://php.net/manual/en/function.unlink.php

$fileName = $_POST['fileName'];

array_map('unlink', glob('saved/' . $fileName));

?>