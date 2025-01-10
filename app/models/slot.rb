class Slot < ApplicationRecord
  belongs_to :slot_type
  belongs_to :room
  validates :is_occupied, inclusion: { in: [true, false] }
end
