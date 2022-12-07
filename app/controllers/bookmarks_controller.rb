class BookmarksController < ApplicationController
  def create
    Bookmark.create(user_id: current_user.id, post_id: params[:post_id])
    flash[:info] = "ブックマークしました！"
    redirect_to request.referer
  end

  def destroy
    bookmark = Bookmark.find_by(user_id: current_user.id, post_id: params[:post_id])
    bookmark.destroy
    flash[:warning] = "ブックマークを解除しました．"
    redirect_to request.referer
  end
end
