Rails.application.routes.draw do
  resources :events
  resources :reservations
  resources :admins
  resources :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
