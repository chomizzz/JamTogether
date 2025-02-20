class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :authorize_user

  def authorize_user
    # Skip authorization for devise controllers
    return if devise_controller?

    # Pour toutes les autres pages, on vérifie que l'utilisateur est connecté
    unless current_user
      redirect_to new_user_session_path
    end
  end

end
