class FixDecimalPrecisionAndAddIndexesToStuffs < ActiveRecord::Migration[8.0]
  def change
    # Change quantity column to specify precision and scale
    change_column :stuffs, :quantity, :decimal, precision: 10, scale: 2

    # Add indexes for frequently queried columns
    add_index :stuffs, :archived
    add_index :stuffs, :expiration_date
  end
end
