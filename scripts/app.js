/* app.js is intended to be the main client-side javascript file for the website. */


// Checks if the page is completely loaded (including images, scripts, styles, etc.)
document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        // Run functions that need to be run after the page is completely loaded here.
        callback();
    }
}

// "Main" function
function callback() {

}

function handleFormSubmit(event) {
    event.preventDefault();
    form = event.currentTarget;
    url = form.action;
    updateErrors(url);
}

async function updateErrors(url) {
    console.log("check in");
    const res = await fetch(url);
    console.log(res.json());
}