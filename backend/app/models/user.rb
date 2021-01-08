class User < ApplicationRecord
    has_many :reservations
    has_many :events, through: :reservations
end
