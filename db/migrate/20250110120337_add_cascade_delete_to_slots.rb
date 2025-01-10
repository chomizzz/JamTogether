class AddCascadeDeleteToSlots < ActiveRecord::Migration[6.0]
  def change
    add_foreign_key :slots, :rooms, on_delete: :cascade
  end
end