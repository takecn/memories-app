class FavoritesController < ApplicationController
  def create
    favorite = Favorite.create(user_id: current_user.id, post_id: params[:post_id])
    favorite.create_favorite_notice(current_user)
    flash[:info] = "お気に入り登録しました！"
    redirect_to request.referer
  end

  def destroy
    favorite = Favorite.find_by(user_id: current_user.id, post_id: params[:post_id])
    favorite.destroy
    flash[:warning] = "お気に入り登録を解除しました．"
    redirect_to request.referer
  end
end
