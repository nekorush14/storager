# Stuffs Table
#
# name: string
# description: text
#
class Stuff < ApplicationRecord
  validates :name, presence: true

  has_many :tags, as: :taggable
end
