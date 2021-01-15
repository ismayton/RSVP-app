class UsersController < ApplicationController
    def create
        user = User.find_or_create_by(email: params[:email], name: params[:name])
        event = Event.find(params[:event_id])
        if event
            user.events << event
            render json: { user: user, event_id: event.id }
        else
            render json: user, except: [:created_at, :updated_at]
        end   
    end
end
