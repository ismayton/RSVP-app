class UsersController < ApplicationController
    def create
        user = User.find_or_create_by(email: params[:email], name: params[:name])
        event = Event.find(params[:event_id])

        
        if user.valid?
            if event
                user.events << event
                percent_full = (event.capacity.to_f - event.users.count.to_f) / event.capacity.to_f * 100
                render json: { user: user, event_id: event.id, percent_full: percent_full }
            else
                render json: user, except: [:created_at, :updated_at]
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
        percent_full = (event.capacity.to_f - event.users.count.to_f) / event.capacity.to_f * 100

        render json: { user: user, event_id: event.id, percent_full: percent_full}
    end

end
