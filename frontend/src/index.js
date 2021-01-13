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
        event.classList.add('event')
        event.innerHTML = `<h2>${eventJson.title}</h2>
        <p>Date: ${eventJson.date}</p>
        <p>Location: ${eventJson.location}</p>
        <p>Description: ${eventJson.description}</p>
        <p>Seats Remaining: ${eventJson.capacity - eventJson.users.length}</p>
        `
        eventJson.users.map(user => {
            let userDiv = document.createElement('li')
            userDiv.classList.add('user')
            userDiv.innerText = `Name: ${user.name}
            Email: ${user.email}`
            console.log(userDiv) 
            event.appendChild(userDiv)
        })
        
        main.appendChild(event)
    })
}
