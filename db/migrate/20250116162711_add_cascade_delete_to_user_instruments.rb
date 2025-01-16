class AddCascadeDeleteToUserInstruments < ActiveRecord::Migration[8.0]
  def change
    remove_foreign_key :user_instruments, :slots

    add_foreign_key :user_instruments, :slots, on_delete: :cascade
  end
end
