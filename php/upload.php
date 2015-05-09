<?php

/*
	Sources: 
		http://stackoverflow.com/questions/13198131/how-to-save-a-html5-canvas-as-image-on-a-server
		http://j-query.blogspot.com/2011/02/save-base64-encoded-canvas-image-to-png.html
		http://www.codepool.biz/tech-frontier/html5/upload-html-canvas-data-to-php-server.html
		http://php.net/manual/en/function.imagecopy.php
		http://php.net/manual/en/function.imagecolortransparent.php
		https://www.codepunker.com/blog/how-to-merge-png-files-with-php-and-GD-Library
		http://stackoverflow.com/questions/10246249/trouble-with-replacing-transparent-color-in-php
*/

	// Convert the data URL in the posted form data to a PNG.
	$img = $_POST['hiddenData'];
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
	$fileName = $_POST['sketchName'];
	$file = 'saved/' . $fileName . '.png';
	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';
	
	// Define a temporary image with a transparent background.
	define("WIDTH", 968);
	define("HEIGHT", 665);
	$temporary_image = imagecreatetruecolor(WIDTH, HEIGHT);
	imagesavealpha($temporary_image, true);
	$transparent = imagecolorallocatealpha($temporary_image, 0, 0, 0, 127);
	imagefill($temporary_image, 0, 0, $transparent);
	
	// Copy the sketch to the temporary image.
	$first_layer = imagecreatefrompng('background/background.png');
	imagesavealpha($first_layer, true);
	$second_layer = imagecreatefrompng($file);
	imagesavealpha($second_layer, false);
	imagecopy($temporary_image, $first_layer, 0, 0, 0, 0, WIDTH, HEIGHT);
	imagecopy($temporary_image, $second_layer, 0, 0, 0, 0, WIDTH, HEIGHT);
	
	// Remove any white "erase" marks from the final image.
	imagealphablending($temporary_image, false);
	$white_color_transparent = imagecolorallocatealpha($temporary_image, 255, 255, 255, 127);
	for ($y = 0; $y < imagesy($temporary_image); $y++) {
		for ($x = 0; $x < imagesx($temporary_image); $x++) {
			$rgb = imagecolorat($temporary_image, $x, $y);
			$pixel_color = imagecolorsforindex($temporary_image, $rgb);
			if (($pixel_color['red'] == 255 && $pixel_color['green'] == 255 && $pixel_color['blue'] == 255)) {
				imagesetpixel($temporary_image, $x, $y, $white_color_transparent);
			}
		}
	}
	imagesavealpha($temporary_image, true);
	
	// Save the new image.
	imagepng($temporary_image, $file);
	
	// Release the temporary variables.
	imagedestroy($first_layer);
	imagedestroy($second_layer);
	imagedestroy($temporary_image);
?>