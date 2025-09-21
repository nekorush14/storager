class CreateTags < ActiveRecord::Migration[8.0]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.text :description
      t.string :color_code
      t.references :taggable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
