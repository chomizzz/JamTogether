Rails.application.routes.draw do
  get "home/index"
  # Routes pour les utilisateurs via Devise
  devise_for :users, controllers: { registrations: 'users/registrations' }

  # Définition des routes pour Room (les salles)
  resources :roomsroute

  resources :rooms do
    member do
      get 'join'
    end
  end


  post 'join', to: 'rooms#join'

  # Autres routes de l'application
  get "up" => "rails/health#show", as: :rails_health_check

  # Route racine (optionnelle)
  root "home#index"
end