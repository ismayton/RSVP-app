class UsersController < ApplicationController
    def create
        puts "lookie here"
        puts params
        user = User.find_or_create_by(email: params[:email], name: params[:name])
        event = Event.find(params[:event_id])
        if event
            puts "event ID detected"
            user.events << event
            render json: user
        else
            render json: user
        end   
    end
end
