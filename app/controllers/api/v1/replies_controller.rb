module Api
  module V1
    class RepliesController < ApplicationController
      def create
        Reply.create(reply_params)
        # @replies = Reply.where(post_id: @reply.post_id)
        #! @reply.create_reply_notice(@replies, current_user)
        render json: { message: "コメントしました！" }, status: :created
      end

      def destroy
        reply = Reply.find(params[:id])
        reply.destroy
        render json: { message: "コメントを削除しました．" }, status: :ok
      end

      private

      def reply_params
        params.permit(:reply).merge(user_id: current_user.id, post_id: params[:post_id])
        # params.require(:reply).permit(:reply).merge(user_id: current_user.id, post_id: params[:post_id])
      end
    end
  end
end
