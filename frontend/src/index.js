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

// Event functions: render event from Json, render form for adding user //
function eventHTML(eventJson) {
    let event = document.createElement('div')
    event.classList.add('event')
    event.id = eventJson.id

    let seatsRemaining = eventJson.capacity - eventJson.users.length
    let percentFull = ((eventJson.capacity - seatsRemaining) / eventJson.capacity) * 100
    
    event.innerHTML = `<h2>${eventJson.title}</h2>
    <p>Date: ${eventJson.date}</p>
    <p>Location: ${eventJson.location}</p>
    <p>Description: ${eventJson.description}</p>
    <p class="seats-remaining">Seats Remaining: ${seatsRemaining}</p>
    <div class="status-bar"><div class="status-bar-fill" style="width:${percentFull}%"></div></div>
    `

    event.appendChild(eventFormHTML(eventJson))
    
    let ul = document.createElement('ul')
    event.appendChild(ul)
    eventJson.users.map( user => {
        userDiv = usersHTML(user)
        userDiv.id = `event${event.id}user${user.id}`
        ul.appendChild(userDiv)
    })
    return event
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
    })
    return form
}

// User functions: render in DOM, fetch-post new, render from fetch //
function usersHTML(user) {
    let userDiv = document.createElement('li')
    userDiv.classList.add('user')
    userDiv.innerText = `Name: ${user.name}
    Email: ${user.email}`
    addDeleteButton(userDiv)
    return userDiv
}

function addDeleteButton(userDiv) {
    let button = document.createElement('button')
    button.classList.add('remove-user')
    button.innerText = 'remove'
    button.addEventListener( 'click', function() {
        removeUser(userDiv)
    } ) 
    userDiv.appendChild(button)
}

function postUser(formData) {
    let configObj = {
        method: 'post',
        body: formData
    }
    return fetch(USERS_URL, configObj)
    .then( response => { return response.json(); })
    .then( json =>  { renderUserFromJson(json) })
}

function renderUserFromJson(json) {
    if (json.error) {
        alert(json.error)
    } else {
        let userDiv = usersHTML(json.user)
        userDiv.id = `event${json.event_id}user${json.user.id}`
        let event = document.getElementById(json.event_id)
        
        let ul = event.querySelector('ul')
        ul.appendChild(userDiv)
        updateStatusBar(json)
        updateSeatCount(json)
    }
}

function removeUser(userDiv) {

    let configObj = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(parseUserId(userDiv))
    }
    return fetch(USERS_URL + '/' + userDiv.id, configObj)
    .then( response => { return response.json(); })
    .then( json =>  { removeUserFromJson(json) })
}

function parseUserId(userId) {
    let idArray = userId.id.split("event")[1].split("user")
    return {"event_id": idArray[0], "user_id": idArray[1]}
}

function removeUserFromJson(json) {
    if (json.error) {
        alert(json.error)
    } else {
        let user = document.getElementById(`event${json.event_id}user${json.user.id}`)
        user.remove()
        updateStatusBar(json)
        updateSeatCount(json)
    }
}

function updateStatusBar(json) {
    let event = document.getElementById(json.event_id)
    let statusBar = event.getElementsByClassName('status-bar-fill')[0]
    statusBar.style.width = `${100 - json.percent_full}%`
}

function updateSeatCount(json) {
    let event = document.getElementById(json.event_id)
    let seatCount = event.getElementsByClassName('seats-remaining')[0]
    seatCount.innerText = `Seats Remaining: ${json.remaining}`
}