# Tags Table
#
# name: string, not null
# description: text
# color_code: string
# taggable: references
#
class Tag < ApplicationRecord
  validates :name, presence: true
  belongs_to :taggable, polymorphic: true, optional: true
end
