module Api
  module V1
    class BookmarksController < ApplicationController
      def create
        Bookmark.create(user_id: current_user.id, post_id: params[:post_id])
        render json: { message: "ブックマークしました！" }, status: :created
      end

      def destroy
        bookmark = Bookmark.find_by(user_id: current_user.id, post_id: params[:post_id])
        bookmark.destroy
        render json: { message: "ブックマークを解除しました．" }, status: :ok
      end
    end
  end
end
