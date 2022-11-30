class BookmarksController < ApplicationController
  def create
    @post = Post.find(params[:post_id])
    @bookmark = Bookmark.create(user_id: current_user.id, post_id: @post.id)
    flash[:info] = "ブックマークしました！"
    redirect_to request.referer
  end

  def destroy
    @post = Post.find(params[:post_id])
    @bookmark = Bookmark.find_by(user_id: current_user.id, post_id: @post.id)
    @bookmark.destroy
    flash[:warning] = "ブックマークを解除しました．"
    redirect_to request.referer
  end
end
