class HomeController < ApplicationController
  def index
    @rooms = Room.includes(:user_admin).all
  end
end
