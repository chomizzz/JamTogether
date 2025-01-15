class RenameCurrentNumberPlayerToCurrentPlayerNumber < ActiveRecord::Migration[8.0]
  def change
    rename_column :rooms, :current_number_player, :current_player_number
  end
end
