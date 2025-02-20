class Instrument < ApplicationRecord
  has_many :slot_type_instruments
  has_many :slot_types, through: :slot_type_instruments
  has_many :user_instruments
end
