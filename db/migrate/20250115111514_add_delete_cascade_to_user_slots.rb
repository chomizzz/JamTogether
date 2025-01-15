class AddDeleteCascadeToUserSlots < ActiveRecord::Migration[8.0]
  def change
    # Supprimer l'ancienne contrainte
    remove_foreign_key :user_slots, :rooms

    # Ajouter une nouvelle contrainte avec delete cascade
    add_foreign_key :user_slots, :rooms, on_delete: :cascade
  end
end
