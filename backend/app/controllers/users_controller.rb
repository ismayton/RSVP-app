class UsersController < ApplicationController
    def create
        user = User.find_or_create_by(email: params[:email], name: params[:name])
        event = Event.find(params[:event_id])
        if user.valid?
            if event && !event.users.include?(user)
                user.events << event
                render json: { user: user, event_id: event.id, remaining: event.seats_remaining, percent_full: event.percent_full }
            else
                errors = "#{user.name} is already RSVP'd to this event."
                render json: { error: errors, event_id: event.id }
            end 
        else
            errors = user.errors.full_messages.join(', ')
            render json: { error: errors, event_id: event.id }
        end   
    end

    def update
        user = User.find(params[:user_id])
        event = Event.find(params[:event_id])
        event.users.delete(user)
        
        render json: { user: user, event_id: event.id, remaining: event.seats_remaining, percent_full: event.percent_full}
    end

end
