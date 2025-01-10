class AddPlayerPlayingToRooms < ActiveRecord::Migration[8.0]
  def change
    add_column :rooms, :player_playing, :integer
  end
end
