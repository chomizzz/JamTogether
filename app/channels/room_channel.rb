class RoomChannel < ApplicationCable::Channel
  def subscribed
    # Rejoindre un stream spécifique à la Room
    @room = Room.find(params[:id])
    stream_from "room_#{@room.id}"
  end

  def unsubscribed
    # Logique à exécuter lors de la déconnexion, si nécessaire
  end

end
