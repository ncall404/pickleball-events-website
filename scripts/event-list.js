/* event-lsit.js is intended to contain the client-side javascript specific to the event-list.html page. */


// Checks if the page is completely loaded (including images, scripts, styles, etc.)
document.addEventListener("DOMContentLoaded", () => {
    // Run functions that need to be run after the page is completely loaded here.
    var query = window.location.search;
    var urlParams = new URLSearchParams(query);
    var type = urlParams.get('type')
    if (type !== '' || type !== undefined) {
        fetchEvents(type);
    }
    callback();
});

// "Main" function. Handles generic stuff like adding event listeners.
function callback() {
    var availableTab = document.getElementById("availableTab");
    availableTab.addEventListener("click", () => fetchEvents("available"));
    var joinedTab = document.getElementById("joinedTab");
    joinedTab.addEventListener("click", () => fetchEvents("joined"));
    var createdTab = document.getElementById("createdTab");
    createdTab.addEventListener("click", () => fetchEvents("created"));
}

// Gets the data to fill the event lists from the server/database.
// Has no return value, directly manipulates webpage.
async function fetchEvents(type) {
    var url = document.URL;
    var splitUrl = url.split('?');
    var newUrl = splitUrl[0] + "?type=" + type;
    var res = await fetch(newUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    var contents = await res.json();
    var eventList = contents.events;
    var listContainer = document.getElementById(type + "EventsList");
    listContainer.innerHTML = "";
    eventList.forEach(event => {
        var eventDateTime = new Date(event.EventDateTime);
        eventDateTime.setMinutes(eventDateTime.getMinutes() + -(eventDateTime.getTimezoneOffset()));
        var formattedDateTime = eventDateTime.toLocaleString('en-US', {dateStyle: "short", timeStyle: "short"});

        var eventCard = createEventCard(type, event.EventID, event.EventName, event.Description, formattedDateTime, event.StreetAddress, event.City, event.StateInitials, event.ZipCode, event.FirstName, event.LastName);

        listContainer.append(eventCard);
    });
}

function createEventCard (type, eventID, eventName, eventDescription, eventDateTime, eventAddress, eventCity, eventState, eventZIP, firstName, lastName) {
    var eventCard = document.createElement("div");
    eventCard.className = "card shadow border-0 rounded-4 mb-5";
    var eventCardBody = document.createElement("div");
    eventCardBody.className = "card-body p-5";
    var eventCardRow = document.createElement("div"); 
    eventCardRow.className = "row align-items-center gx-5";
    var eventColumnOne = document.createElement("div");
    eventColumnOne.className = "col text-center text-lg-start mb-4 mb-lg-0";
    var eventColumnOneBackground = document.createElement("div");
    eventColumnOneBackground.className = "bg-light p-4 rounded-4";
    eventColumnOneBackground.id = "eventColumnOneBackground";
    var eventColumnTwo = document.createElement("div");
    eventColumnTwo.className = "col-lg-8";

    var eventDateContainer = document.createElement("div");
    eventDateContainer.className = "text-primary fw-bolder mb-2";
    eventDateContainer.innerText =eventDateTime;
    var eventNameContainer = document.createElement("div");
    eventNameContainer.className = "small fw-bolder";
    eventNameContainer.innerText = eventName;
    var eventAddressContainer = document.createElement("div");
    eventAddressContainer.className = "small fw-bolder";
    eventAddressContainer.innerText = eventAddress;
    var eventCityStateContainer = document.createElement("div");
    eventCityStateContainer.className = "small text-muted";
    eventCityStateContainer.innerText = eventCity + ", " + eventState + ", " + eventZIP;
    var eventCreatorContainer = document.createElement("div");
    eventCreatorContainer.className = "small text-muted";
    eventCreatorContainer.innerText = "Owner: " + firstName + " " + lastName;
    eventColumnOneBackground.append(eventDateContainer, eventNameContainer, eventAddressContainer, eventCityStateContainer, eventCreatorContainer);
    if (type === "available") {
        var eventJoinButtonContainer = document.createElement("div");
        eventJoinButtonContainer.className = "d-grid gap-3 d-sm-flex justify-content-sm-left justify-content-xxl-start mb-3";
        var eventJoinButton = document.createElement("a");
        eventJoinButton.className = "btn btn-outline-dark btn-lg px-5 py-3 fs-6 fw-bolder";
        eventJoinButton.href = "./event-list/join/" + eventID;
        eventJoinButton.text = "Join";
        eventJoinButtonContainer.append(eventJoinButton);
        eventColumnOneBackground.append(eventJoinButtonContainer);
    }
    eventColumnOne.append(eventColumnOneBackground);

    var eventDescriptionContainer = document.createElement("div");
    eventDescriptionContainer.innerText = eventDescription;
    eventColumnTwo.append(eventDescriptionContainer);

    eventCardRow.append(eventColumnOne, eventColumnTwo);
    eventCardBody.append(eventCardRow);
    eventCard.append(eventCardBody);
    
    return eventCard;
}