// Toggles a server response message.
function toggleXHRMessage(text) {
    var message = $("#xhrMessage");
    message.html(text);
    message.fadeToggle({ duration: 500 });
    window.setTimeout(function() {
        message.fadeToggle({ duration: 500 });
    }, 3500);
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
    Start the sketch.js functionality and set the canvas background image (for edit mode). Source:
        http://stackoverflow.com/questions/15401476/saving-canvas-with-the-background-image
*/
function loadCanvas() {
    
    $("#sketchCanvas").attr({
        height: 665,
        width: 968
    }).sketch();
    
    return false;
}

// Clear the canvas of any content.
function clearCanvas() {
    var xhr = $.ajax({
        method: "POST",
        url: "php/reset.php",
        success: function() {
            window.location.reload();
            // Work around to prevent Firefox from caching out of date background images for the sketch area.
            if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
                window.location.href = "http://bullen.io/cscie12/main.html";
                window.location.reload(true);
            }
        },
        fail: function() {
            toggleXHRMessage("Oops. Try again!");
        }
    });
    return false;
}

/*
    Force a page repaint in Firefox to work around excessive caching. This is needed for the edit image feature.
    Without it, you have to manually reload the page to see the correct image to edit. Sources:
        http://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js
        http://stackoverflow.com/questions/6985507/one-time-page-refresh-after-first-page-load
*/
function firefoxCacheFix() {
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
        if (!window.location.hash) {
            window.location = window.location + "#loaded";
            window.location.reload(true);
        }
    }
    return false;
}

/*
    Save the sketch to the server. Sources: 
        http://stackoverflow.com/questions/13198131/how-to-save-a-html5-canvas-as-image-on-a-server
        http://j-query.blogspot.com/2011/02/save-base64-encoded-canvas-image-to-png.html
        http://www.codepool.biz/tech-frontier/html5/upload-html-canvas-data-to-php-server.html
*/
function saveSketchToServer(e) {
    
    e.preventDefault();
    
    $("#sketchSubmit").blur();
    var fileName = $("#sketchName").val();
    if (!fileName || fileName.length < 1 || fileName === "") {
        toggleXHRMessage("Remember to name your sketch!");
        $("#sketchName").focus();
        return false;
    }
    
    var dataURL = document.getElementById("sketchCanvas").toDataURL("image/png");
    document.getElementById("hiddenData").value = dataURL;
    var fd = new FormData(document.forms[0]);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "php/upload.php", true);   
    xhr.send(fd);
    xhr.onreadystatechange  = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            toggleXHRMessage("Saved to the server as " + fileName + ".png");
        }
        if (xhr.readyState == 4 && xhr.status != 200) {
            toggleXHRMessage("Couldn't save it. Try again!");
        }
    }
    
    return false;
}

// Toggle the draw/erase button text and canvas cursors.
function toggleDrawAndErase(e) {
    e.preventDefault();
    var toggle = document.getElementById("sketchToggle");
    toggle.blur();
    var color = toggle.getAttribute("data-color");
    if (color === "color") {
        toggle.setAttribute("data-color", "blank");
        toggle.innerHTML = "Draw!";
        $("#sketchCanvas").css({ "cursor": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAe0lEQVQ4y2NgQAOMSh4GDIruM4H4JhD/hGIQeyZYDhdgUfHiAiqaDcR/gfg/DgySmw1Wi0XzQTwa0fFBVEMgNhOrGYZnI/v5LxkG/IWECSTASNUMwzMZoCFMrgE3GaDRRK4BP6liAMVeoCwQKY9GShMSdZIypZmJkuwMAGdhI8DwLZI0AAAAAElFTkSuQmCC) 0 8, default" });
    } else {
        toggle.setAttribute("data-color", "color");
        toggle.innerHTML = "Erase";
        $("#sketchCanvas").css({ "cursor": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIcSURBVFhHvZY9T8JAGMfveoXRxcVBSUDlMxgWw4TVQUfjYPwyfgzdWJwR4mBMHIgJJBqdxIYBSTQuJsTBQGn937Ulhda+l1/S9rmW8Pz63EuP0tLerWEYv5TSLiWkI8tyd9xrfJIlQUmxVsf1xGzOGOLoQqpDKenKjD2Me9cj81G6SEjyaMVO1nEcoTLnum7cjCfai7y9XzIfpQsEyLMV+1HQtOldFhIS+vzJioPIRALjDhRrHziviTiYgSyzqvbW7FvtREjWNWwVOKISufJBKpUQAiHHgZPCZKKlImFVwHMmBJGKhBBgktTGJc48TywhBDS1OWBMUhDGlsjHlDBngQXbUirTqd5CuGLeicQgn5OrWDEjzY45Ac6yJVwCnGVK2OvAHFO11cZiE3tM4NsRemB6VsAGy24Fi07sSuRQiUlAJXwFOFlLBApwspTwHAOL4MOTZEz45ghVAZsYlRji7Xf9uiBUBWwiVsKVHNP7eHE/EUmAE1LCnXxTOcPaUuefcqdEpC5w4tMdruQSkuu6fsFD8w42NQybGrXZjy3A8ZAIk9xGSCQS4DgkRhGSC7Ajv0oswIHEDv7sK0py0M7nc0oqAouIAReQHNVSIDxi1o3UQPJTJL9E6PvmPDlv/Pej+FCi4vxjNlyI5OPXxmwKZ9MF3vsJV3JOJgIcdEUFXWFLzPpcPHSQ+hiwMb7Vd7Zavke4gTc/9EpOCCF/rnoly/pe1dsAAAAASUVORK5CYII=) 0 0, pointer" });
    }
    return false; 
}

// Main page loading sequence.
$(document).ready(function() {
    
    // Start the Zurb Foundion 5 layout functionality.
    $(this).foundation();
    
    // Make sure the server message element is hidden from view.
    $("#xhrMessage").hide();
    
    // Load the canvas element and start the sketch.js functionality.
    loadCanvas();
    
    // Add an event listener to the "Save" button.
    $("#sketchForm").submit(saveSketchToServer);
    
    // Add an event listener to the "Draw/Erase" toggle button.
    $("#sketchToggle").click(toggleDrawAndErase);
    
    // Add an event listener to the "New" button.
    $("#sketchNew").click(clearCanvas);
    
    // Add an event listener for the "About" button modal.
    loadModal();
    
    // Check if the browser is Firefox and reload if it is (cache fix workaround).
    firefoxCacheFix();
    
    return false;
});