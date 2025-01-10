class CreateUserSlots < ActiveRecord::Migration[8.0]
  def change
    create_table :user_slots do |t|
      t.references :user, null: false, foreign_key: true
      t.references :slot, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true

      t.timestamps
    end
  end
end
