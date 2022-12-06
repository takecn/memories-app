class Group < ApplicationRecord
  has_one_attached :group_avatar
  has_many :group_users, dependent: :destroy
  has_many :users, through: :group_users

  validates :group_avatar, content_type: { in: %w(image/jpeg image/gif image/png), message: "のファイル形式は，JPEG, GIF, PNGのみ添付可能です．" },
                           size: { less_than: 5.megabytes, message: "のデータ容量は5MB以下として下さい．" }
  validates :group_name, presence: true, uniqueness: true, on: :create

  def group_user(user)
    group_users.find_by(user_id: user.id)
  end
end
