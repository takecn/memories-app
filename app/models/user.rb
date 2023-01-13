class User < ApplicationRecord
  has_secure_password
  has_one_attached :user_avatar
  has_many :posts
  has_many :favorites, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :replies
  has_many :group_users
  has_many :groups, through: :group_users
  has_many :active_notices, class_name: "Notice", foreign_key: "sender_id", dependent: :destroy
  has_many :passive_notices, class_name: "Notice", foreign_key: "receiver_id", dependent: :destroy

  validates :user_avatar, content_type: { in: %w(image/jpeg image/gif image/png), message: "のファイル形式は，JPEG, GIF, PNGのみ添付可能です．" },
                          size: { less_than: 5.megabytes, message: "のデータ容量は5MB以下として下さい．" }
  validates :password_confirmation, presence: true, on: :create
  validates :user_name, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
end
