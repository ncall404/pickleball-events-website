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
    document.querySelectorAll('form').forEach(form => form.addEventListener("submit", handleFormSubmit));
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
            //var errorElement = document.createElement("p");
            //errorElement.innerHTML = error.path + ": " + error.msg;
            //messageContainer.appendChild(errorElement);
            var errorString = document.createTextNode(error.path + ": " + error.msg);
            messageContainer.appendChild(errorString);
            messageContainer.appendChild(document.createElement("br"));
            console.log(error.path+": "+error.msg);
        });
    }
}