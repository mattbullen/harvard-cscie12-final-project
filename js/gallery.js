// Toggles a server response message.
function toggleXHRMessage(text, page, fade) {
	var message = $("#galleryMessage");
	message.html(text);
	message.fadeToggle({ duration: 500 });
	if (page) {
		if (page === "new") {
			newCanvas("galleryMessage");
		} else {
			message.click(function() {
				window.location = "http://bullen.io/cscie12/" + page + ".html";
			});
		}
	}
	if (fade) {
		window.setTimeout(function() {
			message.fadeToggle({ duration: 500 });
		}, 3500);
	}
	return false;
}

// Load the "About" button's modal.
function loadModal() {
	$("#about").click(function() {
		$("#modal").foundation("reveal", "open", {
			url: "http://bullen.io/cscie12/modal/modal.html",
			success: function(data) {
				$("#modal").html(data);
			},
			error: function() {
				$("#modal").html('<a class="close-reveal-modal" aria-label="Close">&#215;</a>The server couldn\'t load the right content. Close this modal and try again.');
			}
		});
	});
	return false;
}

/*
	Sort a JSON object by file name in ascending order. Source:
		http://stackoverflow.com/questions/4340227/sort-mixed-alpha-numeric-array
*/
function sortJSON(a, b) {
	
	a = a.file;
	var parsedA = parseInt(a, 10);
	
	b = b.file;
	var parsedB = parseInt(b, 10);
	
	var regexAlphabetical = /[^a-zA-Z]/g;
	var regexNumerical = /[^0-9]/g;

    if (isNaN(parsedA) && isNaN(parsedB)) {
        var aA = a.replace(regexAlphabetical, "");
        var bA = b.replace(regexAlphabetical, "");
        if (aA === bA) {
            var aN = parseInt(a.replace(regexNumerical, ""), 10);
            var bN = parseInt(b.replace(regexNumerical, ""), 10);
            return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
            return aA > bA ? 1 : -1;
        }
    } else if (isNaN(parsedA)) {
        return 1;
    } else if (isNaN(parsedB)) {
        return -1;
    } else {
        return parsedA > parsedB ? 1 : -1;
    }
}

/*
	Load the gallery from the server:
		1. 	A PHP script (json.php) sends back a list of image file names and URLs in a JSON object.
		2.	The JSON object is checked for usability and sorted by file name in ascending order.
		3.	Handlebars.js then uses the sorted JSON object to template out the gallery HTML.
		4.	Colorbox.js adds some slideshow interactivity.
*/
function loadGallery() {
	
	var xhr = $.post("php/json.php").done(function(data) {
		
		// Check the original JSON object.
		console.log("\nRetrieved JSON:", JSON.stringify(data));
		
		// If there's nothing in there, display a message.
		if (data.original.length < 1) {
			toggleXHRMessage("No saved sketches yet. Let's make one!", "main");
			return false;
		}
		
		// Sort the JSON object by file name in ascending order.
		var sorted = { 
			"sorted": (data.original).slice(0).sort(sortJSON)
		};
		console.log("\nSorted JSON:", JSON.stringify(sorted));
		
		// Template out the gallery slides.
		var template = Handlebars.compile($("#template").html());
		$("#content").html(template(sorted));
		
		// Load the Colobox.js functionality.
		$("a.slideshow").colorbox({
			rel: "slideshow",
			maxWidth: 968,
			opacity: 0.5,
			slideshow: false,
			curregexNumericalt: "Sketch {curregexNumericalt} of {total}"
		});
	
	}).fail(function() {
		
		toggleXHRMessage("The server didn't find your sketches. Try reloading the page.", "gallery");
		
	});
	
	return false;
}

/*
	Start a new sketch. Source for the event delegation solution:
		http://stackoverflow.com/questions/19393656/span-jquery-click-not-working
*/
function newCanvas(id) {
	
	$(document).on("click", "#" + id, function() {
		var xhr = $.ajax({
			method: "POST",
			url: "php/reset.php",
			success: function() {
				window.location = "http://bullen.io/cscie12/main.html";
			},
			fail: function() {
				toggleXHRMessage("Oops. Try again!", false, true);
			}
		});
	});
	
	return false;
}

/*
	Edit a saved sketch. Source for the event delegation solution:
		http://stackoverflow.com/questions/19393656/span-jquery-click-not-working
*/
function editSketch() {
	
	$(document).on("click", ".edit", function() {	
		var file = $(this).attr("data-file-name");
		var xhr = $.ajax({
			method: "POST",
			url: "php/edit.php",
			data: {
				fileName: file
			},
			success: function() {
				window.location = "http://bullen.io/cscie12/main.html";
			},
			fail: function() {
				toggleXHRMessage("The server couldn't open the sketch for editing. Try again!", false, true);
			}
		});
	});
	
	return false;
}

/*
	Delete a saved sketch. Source for the event delegation solution:
		http://stackoverflow.com/questions/19393656/span-jquery-click-not-working
*/
function deleteSketch() {
	
	$(document).on("click", ".delete", function() {	
		var file = $(this).attr("data-file-name");
		var xhr = $.ajax({
			method: "POST",
			url: "php/delete.php",
			data: {
				fileName: file
			},
			success: function() {
				window.location.reload();
			},
			fail: function() {
				toggleXHRMessage("The server couldn't delete the sketch. Try again!", false, true);
			}
		});
	});
	
	return false;
}

// Main page loading sequence.
$(document).ready(function(e) {
	
	// Start the Zurb Foundion 5 layout functionality.
	$(this).foundation();
	
	// Make sure the server message element is hidden from view.
	$("#galleryMessage").hide();
	
	// Load the gallery images from the server.
	loadGallery();
	
	// Add an event listener for the "New" button.
	newCanvas("new");
	
	// Add an event listener for the "About" button modal.
	loadModal();
	
	// Add an event listener for the "Edit" icons.
	editSketch();
	
	// Add an event listener for the "Delete" icons.
	deleteSketch();
	
	return false;
});