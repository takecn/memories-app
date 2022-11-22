class User < ApplicationRecord
  has_secure_password

  with_options on: :create do |sign_up|
    sign_up.validates :password_confirmation, presence: true
    sign_up.validates :user_name, presence: true, uniqueness: true
    sign_up.validates :email, presence: true, uniqueness: true
  end
end
