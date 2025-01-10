class CreateSlots < ActiveRecord::Migration[8.0]
  def change
    create_table :slots do |t|
      t.references :slot_type, null: false, foreign_key: true
      t.boolean :is_occupied

      t.timestamps
    end
  end
end
