/* app.js is intended to be the main javascript file for the website. */


// Checks if the page is completely loaded (including images, scripts, styles, etc.)
document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        // Run functions that need to be run after the page is completely loaded here
        callback();
    }
}

// "Main" function
function callback() {

}