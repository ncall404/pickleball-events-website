/* app.js is intended to be the main client-side javascript file for the website. */


// Checks if the page is completely loaded (including images, scripts, styles, etc.)
document.addEventListener("DOMContentLoaded", () => {
    // Run functions that need to be run after the page is completely loaded here.
    callback();
});


// "Main" function. Handles generic stuff like adding event listeners.
function callback() {
    var forms = document.querySelectorAll('form')
    for (let form of forms) {
        form.addEventListener("submit", handleFormSubmit);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    var form = event.currentTarget;
    var url = form.action;
    var formData = new FormData(form);
    updateErrors(url, formData);
}

async function updateErrors(url, formData) {
    const plainFormData = Object.fromEntries(formData.entries());
    const jsonFormData = JSON.stringify(plainFormData);
    var res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonFormData
    })
    if (res.redirected) {
        window.location.href = res.url;
    } else {
        var contents = await res.json();
        var messageID = contents.messageID;
        var errors = contents.errors;
        var messageContainer = document.getElementById(messageID);
        messageContainer.innerHTML = "";
        errors.forEach(error => {
            messageContainer.className = "alert alert-danger";
            var errorString = document.createTextNode(error.path + ": " + error.msg);
            messageContainer.appendChild(errorString);
            messageContainer.appendChild(document.createElement("br"));
        });
    }
}