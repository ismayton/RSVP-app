const BASE_URL = "http://localhost:3000"
const EVENTS_URL = `${BASE_URL}/events`
const USERS_URL = `${BASE_URL}/users`

class Event {
    constructor(id, title, date, location, description, capacity, users = []) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.location = location;
        this.description = description;
        this.capacity = capacity;
        this.users = users;
    }

    static eventFromJson(json) {
        return new Event(json.event.id, json.event.title, json.event.date, json.event.location, json.event.description, json.event.capacity, json.event_users)
    }

    static eventFromEventJson(eventJson) {
        return new Event(eventJson.id, eventJson.title, eventJson.date, eventJson.location, eventJson.description, eventJson.capacity, eventJson.users)
    }

    get seatsRemaining() {
        return this.capacity - this.users.length
    }

    get percentFull() {
        return ((this.capacity - this.seatsRemaining) / this.capacity) * 100
    }
}

class User {
    constructor(name, email, id, event_id) {
        this.name = name;
        this.email = email;
        this.id = id;
        this.event_id = event_id
    }
    
    static userFromJson(json) {
        return new User(json.user.name, json.user.email, json.user.id, json.event.id)
    }

    get dom_id() {
        return `event${this.event_id}user${this.id}`
    }
}

// Render on DOM loaded //
document.addEventListener('DOMContentLoaded', function fetchEvents() {
    return fetch(EVENTS_URL)
    .then(function(response) { return response.json(); })
    .then(function(json){ renderEvents(json) })
} )

// EVENT FUNCTIONS //

function renderEvents(json) {
    const main = document.querySelector('main')
    json.map( eventJson => {
        main.appendChild(renderEventInDOM(eventJson)) 
    })
}

// Render individual Event from specific event's Json //
function renderEventInDOM(eventJson) {
    let event = Event.eventFromEventJson(eventJson)

    let eventDiv = document.createElement('div')
    eventDiv.classList.add('event')
    eventDiv.id = event.id  
    eventDiv.innerHTML = eventHTML(event)
    eventDiv.appendChild(eventFormHTML(event))
    
    let ul = document.createElement('ul')
    eventDiv.appendChild(ul)

    event.users.map( userJson => {
        let user = new User(userJson.name, userJson.email, userJson.id, event.id)
        let userDiv = userHTML(user)
        ul.appendChild(userDiv)
    })
    return eventDiv
}

// Event's innerHTML generator from event object //
function eventHTML(event) {
    return `<h2>${event.title}</h2>
    <p>Date: ${event.date}</p>
    <p>Location: ${event.location}</p>
    <p>Description: ${event.description}</p>
    <p class="seats-remaining">Seats Remaining: ${event.seatsRemaining}</p>
    <div class="status-bar"><div class="status-bar-fill" style="width:${event.percentFull}%"></div></div>
    `
}

// event's formHTML generator from event object //
function eventFormHTML(event) {
    let form = document.createElement('form')
    form.classList.add('user-form')
    
    form.innerHTML = `<h4>RSVP for ${event.title}</h4>
        <label>Name: </label>
        <input type="text" name="name"></br>
        <label>Email: </label>
        <input type="email" name="email"></br>
        <input type="submit" value="submit">
        </form>`

    form.addEventListener( "submit", function(response) {
        response.preventDefault();
        let formData = new FormData(this);
        formData.append("event_id", event.id)
        postUser(formData);
    })
    return form
}

// USER FUNCTIONS //

// fetch request to post new user from event form, renders in DOM from json //
function postUser(formData) {
    let configObj = {
        method: 'post',
        body: formData
    }
    return fetch(USERS_URL, configObj)
    .then( response => { return response.json(); })
    .then( json =>  { renderUserInDOM(json) })
}


function renderUserInDOM(json) {
    if (json.error) {
        alert(json.error)
    } else {
        let user = User.userFromJson(json)
        let userDiv = userHTML(user)
        
        let ul = document.getElementById(json.event.id).querySelector('ul')
        ul.appendChild(userDiv)
        updateStatusBar(json)
        updateSeatCount(json)
    }
}

// returns a userDiv from a user object //
function userHTML(user) {
    let userDiv = document.createElement('li')
    userDiv.classList.add('user')
    userDiv.id = user.dom_id
    userDiv.innerText = `Name: ${user.name}
    Email: ${user.email}`
    addDeleteButton(userDiv)
    return userDiv
}

// adds delete button and listener to a userDiv //
function addDeleteButton(userDiv) {
    let button = document.createElement('button')
    button.classList.add('remove-user')
    button.innerText = 'remove'
    button.addEventListener( 'click', function() {
        removeUser(userDiv)
    } ) 
    userDiv.appendChild(button)
}

// sends fetch request to delete user, calls to remove userDiv from DOM //
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

// reverse-engineers userDiv id value into array for fetch request //
function parseUserId(userDiv) {
    let idArray = userDiv.id.split("event")[1].split("user")
    return {"event_id": idArray[0], "user_id": idArray[1]}
}

// finds userDiv from json data and removes userDiv from DOM, updating seat count and status bar //
function removeUserFromJson(json) {    
    if (json.error) {
        alert(json.error)
    } else {
        let user = User.userFromJson(json)
        document.getElementById(`${user.dom_id}`).remove()
        updateStatusBar(json)
        updateSeatCount(json)
    }
}

// STATUS BAR AND SEAT COUNT //

function updateStatusBar(json) {
    console.log(json)
    let event = Event.eventFromJson(json)
    let statusBar = document.getElementById(event.id).getElementsByClassName('status-bar-fill')[0]
    statusBar.style.width = `${event.percentFull}%`
}

function updateSeatCount(json) {
    let event = Event.eventFromJson(json)
    let seatCount = document.getElementById(event.id).getElementsByClassName('seats-remaining')[0]
    seatCount.innerText = `Seats Remaining: ${event.seatsRemaining}`
}