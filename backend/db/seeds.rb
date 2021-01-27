EVENTS = [
    {
        title: "Third Space Music Concert", 
        date: "Feb 21 7:30pm", 
        description: "Charity Livestream", 
        location: "Steinway Center", 
        capacity: 50
    },
    {
        title: "Museum Event", 
        date: "March 14 5:30pm", 
        description: "Gallery Opening", 
        location: "MFAH", 
        capacity: 25
    }
]

def create_events
    admin = Admin.find_or_create_by(name: "Mr. Admin", email: "business@email.com", password: "super-secure")

    EVENTS.each do |event_params|
        event = Event.find_or_create_by(event_params)
        admin.events << event
        event.save
    end
end

USERS = {
    {name: "Ian", email: "ian@email.com"} => [1],
    {name: "Jim", email: "jim@email.com"} => [1, 2],
    {name: "Bob", email: "bob@email.com"} => [2]
}

def create_users
    USERS.each do |user_params, event_ids|
        user = User.find_or_create_by(user_params)
        event_ids.each do |event_id|
            user.events << Event.find(event_id)
        end
        user.save
    end
end

def populate_test_db
    create_events
    create_users
end

populate_test_db






