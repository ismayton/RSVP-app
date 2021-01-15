class User < ApplicationRecord
    validates :name, :email, presence: true
    validates :email, uniqueness: true
    
    has_many :reservations
    has_many :events, through: :reservations
end
