class Post < ApplicationRecord
  has_many_attached :post_images
  belongs_to :user
  belongs_to :map
  has_many :favorites, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags
  has_many :replies, dependent: :destroy
  has_many :notices, dependent: :destroy
  has_many :disclosures, dependent: :destroy
  has_many :groups, through: :disclosures

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

  # 投稿に紐つくグループを編集するメソッド
  def set_groups(post, newly_set_group_ids)
    # 設定から外されたグループは投稿との紐付きを解消する．
    existing_group_ids = post.groups.ids
    excluded_group_ids = existing_group_ids - newly_set_group_ids
    excluded_group_ids.each do |excluded_group_id|
      Disclosure.find_by(post_id: post.id, group_id: excluded_group_id).delete
    end

    # 新たに設定されたグループを投稿に紐つける．
    newly_set_group_ids.each do |newly_set_group_id|
      Disclosure.find_or_create_by(post_id: post.id, group_id: newly_set_group_id)
    end
  end
end
