module NoticesHelper
  def post_user(notice)
    Post.find_by(id: notice.post_id).user
  end
end
