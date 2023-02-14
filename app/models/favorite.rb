class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :post
  has_one :notice

  validates_uniqueness_of :post_id, scope: :user_id

  # ユーザーが投稿にfavoriteしたことを通知するnoticeレコードを生成する．通知受信者は投稿者とする．
  def create_favorite_notice(user)
    favorite_notices = user.active_notices.where(receiver_id: post.user_id, post_id: post_id, notice_factor: "favorite")
    if favorite_notices.blank?
      notice = user.active_notices.create(receiver_id: post.user_id, post_id: post_id, favorite_id: id, notice_factor: "favorite")
      # 自らの投稿にユーザーがリプライした場合は通知済みにする．
      notice.checked = true if notice.sender_id == notice.receiver_id
    end
  end
end
