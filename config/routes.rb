Rails.application.routes.draw do
  get "home/index"
  # Routes pour les utilisateurs via Devise
  devise_for :users, controllers: { registrations: "users/registrations" }

  # Définition des routes pour Room (les salles)
  resources :roomsroute

  resources :rooms do
    member do
      get :join
      get :join_as_spectator
      post :submit_join_form
      get :play
    end
  end



  namespace :api do
    namespace :v1 do
      get "join_room/by_slot_type", to: "join_room#by_slot_type"
      resources :slots, only: [ :create ]
    end
  end

  # config/routes.rb
  Rails.application.routes.draw do
    resources :rooms, only: [:show] do
      member do
        get 'join'  # Pour la fonction de récupération des informations de la salle
        post 'submit_join_form'  # Pour soumettre le formulaire
      end
    end
  end




  post "join", to: "rooms#join"

  # Autres routes de l'application
  get "up" => "rails/health#show", as: :rails_health_check

  # Route racine (optionnelle)
  root "home#index"
end