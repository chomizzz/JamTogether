class SlotType < ApplicationRecord
  has_many :slots
  has_many :slot_type_instruments
  has_many :instruments, through: :slot_type_instruments
end
