module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :user_id

    def connect
      self.user_id
    end

    def disconnect
      # Code pour la déconnexion, si nécessaire
    end

    def find_verified_user
      # Par exemple, tu pourrais trouver l'utilisateur en fonction des cookies ou d'un token
      if current_user
        current_user
      else
        reject_unauthorized_connection
      end
    end

  end
end
