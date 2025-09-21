class AddIndexesToTags < ActiveRecord::Migration[8.0]
  def change
    add_index :tags, :name unless index_exists?(:tags, :name)
  end
end
