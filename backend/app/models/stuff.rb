# Stuffs Table
#
# name: string
# description: text
# color_code: string
# quantity: decimal
# unit: string
# expiration_date: timestamp
# archived: boolean
#
class Stuff < ApplicationRecord
  validates :name, presence: true
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :unit, presence: true, if: :quantity?

  has_many :tags, as: :taggable
  accepts_nested_attributes_for :tags
end
