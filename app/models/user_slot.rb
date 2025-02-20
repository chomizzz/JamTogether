class UserSlot < ApplicationRecord
  belongs_to :user
  belongs_to :slot
  belongs_to :room

  after_destroy :update_room_count

  def update_room_count
    room.update(current_player_number: room.user_slots.count)
  end

end
