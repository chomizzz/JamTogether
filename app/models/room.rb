class Room < ApplicationRecord
  belongs_to :user_admin, class_name: "User"
  has_many :slots, dependent: :destroy
  has_many :user_slots, through: :slots

  validates :name, presence: true
  validates :maxPlayer, presence: true, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 4 }
  validates :style, presence: true

  after_update :broadcast_after_join


  MAX_DRUMS = 1
  MAX_BASS = 1
  MAX_SYNTH = 2
  MAX_MICROPHONE = 2
  MAX_SPECTATORS = 15

  def create_playable_slots
    drum_slot_type = SlotType.find_by(name: "Drum")
    bass_slot_type = SlotType.find_by(name: "Bass")
    synth_slot_type = SlotType.find_by(name: "Synth")
    microphone_slot_type = SlotType.find_by(name: "Microphone")


    slots.create(slot_type: drum_slot_type, is_occupied: false, room: self)
    slots.create(slot_type: bass_slot_type, is_occupied: false, room: self)
    2.times { slots.create(slot_type: synth_slot_type, is_occupied: false, room: self) }
    2.times { slots.create(slot_type: microphone_slot_type, is_occupied: false, room: self) }

  end

  def create_spectator_slot
    spectator_slot_type = SlotType.find_by(name: "Spectator")

    spectators = Slot.where(room: self, slot_type: spectator_slot_type).count

    if spectators < MAX_SPECTATORS
      slots.create(slot_type: spectator_slot_type, is_occupied: false, room: self)
    else
      false
    end
  end

  def broadcast_after_join
    broadcast_replace_to(
      "rooms",
      target: "rooms_#{self.id}",
      partial: "rooms/room",
      locals: { room: self }
    )
  end

  def room_param
    params.require(:room).permit(:current_player_number, current_spectator_number)
  end
end
