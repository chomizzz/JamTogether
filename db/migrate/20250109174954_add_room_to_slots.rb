class AddRoomToSlots < ActiveRecord::Migration[8.0]
  def change
    add_reference :slots, :room, null: false, foreign_key: true
  end
end
