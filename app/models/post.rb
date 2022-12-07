class Post < ApplicationRecord
  has_many_attached :post_images
  belongs_to :user
  has_many :favorites, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags
  has_many :replies, dependent: :destroy
  has_many :notices, dependent: :destroy

  validates :post_images, content_type: { in: %w(image/jpeg image/gif image/png), message: "のファイル形式は，JPEG, GIF, PNGのみ添付可能です．" },
                          size: { less_than: 5.megabytes, message: "のデータ容量は5MB以下として下さい．" }

  def favorited_by?(user)
    favorites.where(user_id: user.id).present?
  end

  def bookmarked_by?(user)
    bookmarks.where(user_id: user.id).present?
  end

  def create_tags(entered_tags)
    existing_tags = tags.pluck(:tag_name) unless tags.nil?

    old_tags = existing_tags - entered_tags
    old_tags.each do |old_tag|
      tags.delete Tag.find_by(tag_name: old_tag)
    end

    new_tags = entered_tags - existing_tags
    new_tags.each do |new_tag|
      tags << Tag.find_or_create_by(tag_name: new_tag)
    end
  end
end
