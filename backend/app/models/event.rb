class Event < ApplicationRecord
    has_many :reservations
    has_many :users, through: :reservations
    belongs_to :admin

    def percent_full
        return (self.capacity.to_f - self.users.count.to_f) / self.capacity.to_f * 100
    end

end
