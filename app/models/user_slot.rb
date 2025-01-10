class UserSlot < ApplicationRecord

  add_index :user_slots, :user_id, unique: true
  add_index :user_slots, :room_id, unique: true

  belongs_to :user
  belongs_to :slot
  belongs_to :room
end
