class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :pseudo, presence: true, uniqueness: true, length: { minimum: 4, maximum: 20 }
  has_one :room, foreign_key: :user_admin_id
  has_one :user_slot
end
