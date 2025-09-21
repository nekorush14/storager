class ChangeTaggableToNullableOnTags < ActiveRecord::Migration[8.0]
  def change
    change_column_null :tags, :taggable_type, false
    change_column_null :tags, :taggable_id, false
  end
end
