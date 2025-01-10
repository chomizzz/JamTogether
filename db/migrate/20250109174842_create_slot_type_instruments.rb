class CreateSlotTypeInstruments < ActiveRecord::Migration[8.0]
  def change
    create_table :slot_type_instruments do |t|
      t.references :instrument, null: false, foreign_key: true
      t.references :slot_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
