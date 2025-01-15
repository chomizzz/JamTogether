class AddCurrentPlayerNumberToRooms < ActiveRecord::Migration[8.0]
  def change
    add_column :rooms, :current_number_player, :integer
  end
end
