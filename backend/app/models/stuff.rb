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
  # Define allowed units (Japanese and English)
  ALLOWED_UNITS = %w[
    kg g mg oz lb
    L mL gal qt pt cup tbsp tsp
    個 本 袋 缶 箱 枚
    pieces pcs bottles bags cans boxes sheets
  ].freeze

  validates :name, presence: true
  validates :quantity, numericality: {
    greater_than_or_equal_to: 0,
    less_than: 1_000_000 # Prevent extremely large values
  }, allow_nil: true
  validates :unit, presence: true, if: :quantity?
  validates :unit, inclusion: {
    in: ALLOWED_UNITS,
    message: "は有効な単位ではありません"
  }, if: :unit?

  # Define scopes for common queries
  scope :active, -> { where(archived: false) }
  scope :archived, -> { where(archived: true) }
  scope :expiring_soon, -> { where("expiration_date < ?", 1.week.from_now).where.not(expiration_date: nil) }
  scope :expired, -> { where("expiration_date < ?", Time.current).where.not(expiration_date: nil) }

  has_many :tags, as: :taggable
  accepts_nested_attributes_for :tags
end
