class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :post
  has_one :notice

  validates_uniqueness_of :post_id, scope: :user_id

  # userが新規にfavoriteした際にnoticeレコードを生成
  def create_favorite_notice(user)
    favorite_notices = user.active_notices.where(receiver_id: post.user_id, post_id: :post_id, favorite_id: id, notice_factor: "favorite")
    if favorite_notices.blank?
      notice = user.active_notices.create(receiver_id: post.user_id, post_id: post_id, favorite_id: id, notice_factor: "favorite")
      # 自らの投稿にuserがfavoriteした場合は通知済みにする．
      notice.checked = true if notice.sender_id == notice.receiver_id
    end
  end
end
