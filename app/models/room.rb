class Room < ApplicationRecord
  belongs_to :user_admin, class_name: 'User'
  has_many :slots, dependent: :destroy
  has_many :user_slots

  validates :name, presence: true
  validates :maxPlayer, presence: true, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 3 }
  validates :style, presence: true

end
