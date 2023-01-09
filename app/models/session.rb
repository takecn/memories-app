class Session
  include ActiveModel::Model

  attr_accessor :user_name, :email, :password, :password_confirmation

  validates :user_name, presence: true
  validates :email, presence: true
  validates :password, presence: true
end
