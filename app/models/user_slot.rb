class UserSlot < ApplicationRecord
  belongs_to :user
  belongs_to :slot
  belongs_to :room
end
