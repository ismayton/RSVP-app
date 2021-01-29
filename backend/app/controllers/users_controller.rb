class UsersController < ApplicationController
    def create
        user = User.find_or_create_by(email: params[:email], name: params[:name])
        event = Event.find(params[:event_id])
        if user.valid?
            if event && !event.users.include?(user)
                user.events << event
                render json: { user: user, event: event, event_users: event.users }
            else
                errors = "#{user.name} is already RSVP'd to this event."
                render json: { error: errors }
            end 
        else
            errors = user.errors.full_messages.join(', ')
            render json: { error: errors }
        end   
    end

    def update
        user = User.find(params[:user_id])
        event = Event.find(params[:event_id])
        event.users.delete(user)
        
        render json: { user: user, event: event, event_users: event.users }
    end

end
