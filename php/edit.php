<?php  

// Modified from: http://php.net/manual/en/function.copy.php

$file = 'saved/' . $_POST['fileName'];

$newfile = 'background/background.png';

if (!copy($file, $newfile)) {
    echo "Failed to copy!";
}

?>