class UsersController < ApplicationController
    def create
        puts params
        user = User.find_or_create_by(email: params[:email], name: params[:name])
        event = Event.find(params[:event_id])

        
        if user.valid?
            if event
                user.events << event
                render json: { user: user, event_id: event.id }
            else
                render json: user, except: [:created_at, :updated_at]
            end 
        else
            errors = user.errors.full_messages.join(', ')
            render json: { error: errors, event_id: event.id }
        end   
    end

    def update
        puts params
        user = User.find(params[:user_id])
        event = Event.find(params[:event_id])
        event.users.delete(user)

        render json: { user: user, event_id: event.id}
    end

end
