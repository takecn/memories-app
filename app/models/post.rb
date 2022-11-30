class Post < ApplicationRecord
  has_many_attached :post_images
  belongs_to :user
  has_many :favorites, dependent: :destroy

  validates :post_images, content_type: { in: %w(image/jpeg image/gif image/png), message: "のファイル形式は，JPEG, GIF, PNGのみ添付可能です．" },
                          size: { less_than: 5.megabytes, message: "のデータ容量は5MB以下として下さい．" }

  def favorited_by?(user)
    favorites.where(user_id: user.id).present?
  end
end
