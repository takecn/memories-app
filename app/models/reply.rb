class Reply < ApplicationRecord
  belongs_to :user
  belongs_to :post
  has_many :notices, dependent: :destroy

  # ユーザーが投稿にリプライしたことを通知するためのnoticeレコードを生成する．
  # 通知受信者は，その投稿にリプライした他のユーザー及び投稿者とする．
  def create_reply_notice(user)
    Reply.where(post_id: post_id).each do |reply|
      notice = user.active_notices.create(receiver_id: reply.user_id, post_id: post_id, reply_id: reply.id, notice_factor: "reply")
      # 自らの投稿にユーザーがリプライした場合は通知済みにする．
      notice.checked = true if notice.sender_id == notice.receiver_id
    end
    notice = user.active_notices.create(receiver_id: post.user_id, post_id: post_id, reply_id: id, notice_factor: "reply")
    notice.checked = true if notice.sender_id == notice.receiver_id
  end
end
