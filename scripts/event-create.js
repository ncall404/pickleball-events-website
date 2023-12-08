/* event-create.js is intended to contain the client-side javascript specific to the event-create.html page. */


// Checks if the page is completely loaded (including images, scripts, styles, etc.)
document.addEventListener("DOMContentLoaded", () => {
    // Run functions that need to be run after the page is completely loaded here.
    setMinDate();
    fetchStates();
});

// Sets the minimum date on the date-time picker from the event creation form.
// Has no return value.
function setMinDate() {
    let dateInput = document.getElementById("eventDateTime");
    var minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    dateInput.min = minDate.toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
}

// Gets the data to fill the state selector from the server/database.
// Has no return value, directly manipulates webpage.
async function fetchStates() {
    var stateSelector = document.getElementById("eventState");
    var url = document.URL;

    var res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    var contents = await res.json();
    var stateList = contents.states;
    console.log(stateList);

    stateList.forEach(state => {
        var stateInitial = state.StateInitials;
        var stateName = state.StateName;
        //var stateText = document.createTextNode(stateName);
        var stateOption = document.createElement("option");
        stateOption.value = stateInitial;
        stateOption.innerHTML = stateName;//stateText;
        stateSelector.appendChild(stateOption);
    });
}