class CreateSheets < ActiveRecord::Migration[8.0]
  def change
    create_table :sheets do |t|
      t.string :note
      t.integer :velocity
      t.string :time
      t.references :user_instrument, null: false, foreign_key: true

      t.timestamps
    end
  end
end
