/* event-create.js is intended to contain the client-side javascript specific to the event-create.html page. */


// Checks if the page is completely loaded (including images, scripts, styles, etc.)
document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        // Run functions that need to be run after the page is completely loaded here.
        callback();
    }
}

// "Main" function
function callback() {
    let dateInput = document.getElementById("eventDateTime");
    var minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    dateInput.min = minDate.toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
}