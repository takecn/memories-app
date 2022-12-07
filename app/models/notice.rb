class Notice < ApplicationRecord
  belongs_to :sender, class_name: "User", optional: true
  belongs_to :receiver, class_name: "User", optional: true
  belongs_to :post, optional: true
  belongs_to :favorite, optional: true
  belongs_to :reply, optional: true

  def post_user
    Post.find_by(id: post_id).user
  end
end
