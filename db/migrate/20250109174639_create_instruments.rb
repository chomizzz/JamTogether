class CreateInstruments < ActiveRecord::Migration[8.0]
  def change
    create_table :instruments do |t|
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
