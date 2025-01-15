class AddCurrentSpectatorsNumberToRooms < ActiveRecord::Migration[8.0]
  def change
    add_column :rooms, :current_spectator_number, :integer
  end
end
