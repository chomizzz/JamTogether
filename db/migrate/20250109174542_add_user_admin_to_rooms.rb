class AddUserAdminToRooms < ActiveRecord::Migration[8.0]
  def change
    add_reference :rooms, :user_admin, null: false, foreign_key: { to_table: :users }
  end
end
