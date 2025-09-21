# Tags Table
#
# name: string, not null
# description: text
# color_code: string
# taggable: references
#
class Tag < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :color_code, format: { with: /\A#[0-9A-Fa-f]{6}\z/, message: "must be a valid hex color code" }, allow_blank: true
  belongs_to :taggable, polymorphic: true
end
