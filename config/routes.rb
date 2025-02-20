Rails.application.routes.draw do
  get "chats/index"
  get "chats/create"
  get "room/index"
  # Routes pour les utilisateurs via Devise
  devise_for :users, controllers: { registrations: "users/registrations" }

  post "presence/disconnected", to: "presence#disconnected"

  # Définition des routes pour Room (les salles)
  resources :rooms
  resources :chats

  resources :rooms do
    member do
      post :join
      post :join_as_spectator
      post :submit_join_form
      get :play
      get :show
      get :select_role
    end
  end



  namespace :api do
    namespace :v1 do
      get "join_room/fetch_instruments/:slot_type_id", to: "join_room#fetch_instruments"
    end
  end

  # config/routes.rb
  Rails.application.routes.draw do
  get "chats/index"
  get "chats/create"
    resources :rooms, only: [:show] do
      member do
        get "join"  # Pour la fonction de récupération des informations de la salle
        post "submit_join_form"  # Pour soumettre le formulaire
      end
    end
  end




  post "join", to: "rooms#join"

  # Autres routes de l'application
  get "up" => "rails/health#show", as: :rails_health_check

  # Route racine (optionnelle)
  root "rooms#index"
end