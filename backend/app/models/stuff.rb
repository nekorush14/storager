# Stuffs Table
#
# name: string
# description: text
# color_code: string
#
class Stuff < ApplicationRecord
  validates :name, presence: true

  has_many :tags, as: :taggable
  accepts_nested_attributes_for :tags
end
