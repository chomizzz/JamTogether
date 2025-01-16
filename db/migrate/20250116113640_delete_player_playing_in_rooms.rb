class DeletePlayerPlayingInRooms < ActiveRecord::Migration[8.0]
  def change
    remove_column :rooms, :player_playing, :integer
  end
end
