# Stuffs Table
#
# name: string
# description: text
#
class Stuff < ApplicationRecord
  validates :name, presence: true
end
