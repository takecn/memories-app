module Api
  module V1
    class FavoritesController < ApplicationController
      def create
        Favorite.create(user_id: current_user.id, post_id: params[:post_id])
        # binding.pry
        #! favorite.create_favorite_notice(current_user)
        render json: { message: "お気に入り登録しました！" }, status: :created
      end

      def destroy
        favorite = Favorite.find_by(user_id: current_user.id, post_id: params[:post_id])
        # binding.pry
        favorite.destroy
        render json: { message: "お気に入り登録を解除しました．" }, status: :ok
      end
    end
  end
end
