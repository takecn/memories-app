class Reply < ApplicationRecord
  belongs_to :user
  belongs_to :post
  has_many :notices, dependent: :destroy

  # ユーザーが投稿にリプライしたことを通知するメソッド．
  def create_reply_notice(replies, user)
    # 投稿に既にリプライしていた他のユーザーに通知する（current_userへは通知しない）．
    replies.each do |reply|
      unless reply.user_id == user.id
        user.active_notices.create(receiver_id: reply.user_id, post_id: post_id, reply_id: reply.id, notice_factor: "reply")
      end
    end

    # 投稿者に通知する（投稿者がcurrent_userの場合は通知しない）．
    unless post.user_id == user.id
      user.active_notices.create(receiver_id: post.user_id, post_id: post_id, reply_id: id, notice_factor: "reply")
    end
  end
end
