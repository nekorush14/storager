class AddPropertiesToStuffs < ActiveRecord::Migration[8.0]
  def change
    add_column :stuffs, :quantity, :decimal
    add_column :stuffs, :unit, :string
    add_column :stuffs, :expiration_date, :timestamp
    add_column :stuffs, :archived, :boolean, default: false
  end
end
