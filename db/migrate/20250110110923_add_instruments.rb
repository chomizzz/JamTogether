class AddInstruments < ActiveRecord::Migration[8.0]
  def change
    Instrument.create([
                      { name: 'TripleOscilator', description: 'Select up to 3 waveforms to create complex sounds'},
                      { name: 'DrumKit', description: 'Drum rack to create rythm'},
                      { name: 'BassOscilator', description: 'Oscilator optimized for bass'},
                      { name: 'Microphone-Instrument', description: 'Use your instrument or your voice and upload a loop'},
                    ])
  end
end
