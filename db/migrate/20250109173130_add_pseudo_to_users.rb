class AddPseudoToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :pseudo, :string
  end
end
