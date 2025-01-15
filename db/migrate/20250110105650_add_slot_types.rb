class AddSlotTypes < ActiveRecord::Migration[6.1]
  def change
    # Insertion des nouveaux types de slots
    SlotType.create([
                      { name: 'Spectator', description: 'You can chat with other spectators' },
                      { name: 'Drum', description: 'Select your preferred sound from the presets' },
                      { name: 'Bass', description: 'You create the bass' },
                      { name: 'Synth', description: 'You are in charge of the melody' },
                      { name: 'Microphone', description: 'Use your microphone of join_room' }
                    ])
  end
end
