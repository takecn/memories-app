class User < ApplicationRecord
  has_secure_password

  with_options on: :create do
    validates :password_confirmation, presence: true
    validates :user_name, presence: true, uniqueness: true
    validates :email, presence: true, uniqueness: true
  end

  has_many :posts
end
