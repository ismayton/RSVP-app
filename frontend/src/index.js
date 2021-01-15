const BASE_URL = "http://localhost:3000"
const EVENTS_URL = `${BASE_URL}/events`
const USERS_URL = `${BASE_URL}/users`

document.addEventListener('DOMContentLoaded', fetchEvents() )

function fetchEvents() {
    return fetch(EVENTS_URL)
    .then(function(response) { return response.json(); })
    .then(function(json){ renderEvents(json) })
}

function renderEvents(json) {
    const main = document.querySelector('main')
    json.map( eventJson => main.appendChild(eventHTML(eventJson)) )
}

// forms each event from single event JSON object //

function eventHTML(eventJson) {
    let event = document.createElement('div')
    event.classList.add('event')
    event.id = eventJson.id
    event.innerHTML = `<h2>${eventJson.title}</h2>
    <p>Date: ${eventJson.date}</p>
    <p>Location: ${eventJson.location}</p>
    <p>Description: ${eventJson.description}</p>
    <p>Seats Remaining: ${eventJson.capacity - eventJson.users.length}</p>
    `
    event.appendChild(eventFormHTML(eventJson))
    
    let ul = document.createElement('ul')
    event.appendChild(ul)
    eventJson.users.map( user => ul.appendChild(usersHTML(user)) )
    return event
}

// forms user class DOM objects from event.users //
function usersHTML(user) {
    let userDiv = document.createElement('li')
    userDiv.classList.add('user')
    userDiv.innerText = `Name: ${user.name}
    Email: ${user.email}`
    return userDiv
}

function eventFormHTML(eventJson) {
    let form = document.createElement('form')
    form.classList.add('user-form')
    
    form.innerHTML = `<h4>RSVP for ${eventJson.title}</h4>
        <label>Name: </label>
        <input type="text" name="name"></br>
        <label>Email: </label>
        <input type="email" name="email"></br>
        <input type="submit" value="submit">
        </form>`

    form.addEventListener( "submit", function(event) {
        event.preventDefault();
        
        let formData = new FormData(this);
        formData.append("event_id", this.parentElement.id)

        postUser(formData);
        // console.log(user)
        // let ul = this.parentElement.querySelector('ul')
        // ul.appendChild(user)
    })
    return form
}

function postUser(formData) {
    let configObj = {
        method: 'post',
        body: formData
    }

    return fetch(USERS_URL, configObj)
    .then(function(response) { return response.json(); })
    .then(function(json) { renderUserFromJson(json) })
}

function renderUserFromJson(json) {
    let userDiv = usersHTML(json.user)
    let ul = document.getElementById(json.event_id).querySelector('ul')
    ul.appendChild(userDiv)
}
