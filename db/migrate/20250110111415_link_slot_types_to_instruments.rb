class LinkSlotTypesToInstruments < ActiveRecord::Migration[6.0]
def up
    # Trouver les instruments par leur nom
    drum_kit = Instrument.find_by(name: "DrumKit")
    bass = Instrument.find_by(name: "BassOscillator")
    synth = Instrument.find_by(name: "TripleOscillator")
    microphone = Instrument.find_by(name: "Microphone-Instrument")

    # Associer les instruments aux SlotTypes via la table de jonction slot_type_instruments
    slot_types = SlotType.all

    slot_types.each do |slot_type|
      case slot_type.name
      when "Drum"
        # Associer l'instrument "DrumKit" au slot_type "Drum"
        SlotTypeInstrument.find(slot_type_id: slot_type.id, instrument_id: drum_kit.id) unless slot_type.instruments.include?(drum_kit)
      when "Bass"
        # Associer l'instrument "BassOscillator" au slot_type "Bass"
        SlotTypeInstrument.find_or_create_by(slot_type_id: slot_type.id, instrument_id: bass.id) unless slot_type.instruments.include?(bass)
      when "Synth"
        # Associer l'instrument "TripleOscillator" au slot_type "Synth"
        SlotTypeInstrument.find_or_create_by(slot_type_id: slot_type.id, instrument_id: synth.id) unless slot_type.instruments.include?(synth)
      when "Microphone"
        # Associer l'instrument "Microphone-Instrument" au slot_type "Microphone"
        SlotTypeInstrument.find_or_create_by(slot_type_id: slot_type.id, instrument_id: microphone.id) unless slot_type.instruments.include?(microphone)
      when "Spectator"
        # Pas d'instrument spécifique pour Spectator, mais si nécessaire, vous pouvez ajouter des logiques
      end
    end
  end

  def down
    # Supprimer toutes les associations dans la table de jonction slot_type_instruments
    SlotTypeInstrument.delete_all
  end
end
