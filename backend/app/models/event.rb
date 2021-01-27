class Event < ApplicationRecord
    has_many :reservations
    has_many :users, through: :reservations
    belongs_to :admin

    def percent_full
        (self.capacity.to_f - self.users.count.to_f) / self.capacity.to_f * 100
    end

    def seats_remaining
        self.capacity - self.users.count
    end
end
