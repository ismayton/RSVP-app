document.addEventListener('DOMContentLoaded', fetchEvents() )

function fetchEvents() {
    return fetch("http://localhost:3000/events")
    .then(function(response) { return response.json(); })
    .then(function(json){ renderEvents(json) })
}

function renderEvents(json) {
    const main = document.querySelector('main')
    json.map( eventJson => {
        let event = document.createElement('div')
        
        event.innerHTML = `<h2>${eventJson.title}</h2>
        <p>Date: ${eventJson.date}</p>
        <p>Location: ${eventJson.location}</p>
        <p>Description: ${eventJson.description}</p>
        <p>Seats Remaining: ${eventJson.capacity - eventJson.users.length}</p>
        `

        main.appendChild(event)
        console.log(eventJson)
    })
}
