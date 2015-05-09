// Clear the canvas on the main.html page of any content.
function clearCanvas() {
	var xhr = $.ajax({
		method: "POST",
		url: "php/reset.php",
		success: function() {
			window.location = "http://bullen.io/cscie12/main.html";
		},
		fail: function() {
			window.location.reload();
		}
	});
	return false;
}

// Main page loading sequence.
$(document).ready(function() {
	
	// Start the Zurb Foundion 5 layout functionality.
	$(this).foundation();
	
	// Add an event listener to the "Start a new sketch!" buttons.
	$(".resetCanvas").click(clearCanvas);
	
	return false;
});