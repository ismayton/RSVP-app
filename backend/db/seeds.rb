# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

event = Event.create(title: "Third Space Music Concert", date: "Feb 21 7:30pm", description: "Charity Livestream", location: "Steinway Center", capacity: 50)
user = User.create(name: "Ian Mayton", email: "ianmayton@email.com")
admin = Admin.create(name: "Mr. Admin", email: "business@email.com", password: "super-secure")

admin.events << event
user.events << event
