class Slot < ApplicationRecord
  belongs_to :slot_type
  belongs_to :room
  has_one :user_slot
  validates :slot_type, presence: true
  validates :is_occupied, inclusion: { in: [true, false] }
end
