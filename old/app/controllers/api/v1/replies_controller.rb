module Api
  module V1
    class RepliesController < ApplicationController
      def create
        @reply = Reply.create(reply_params)
        @replies = Reply.where(post_id: @reply.post_id)
        @reply.create_reply_notice(@replies, current_user)
        flash[:info] = "リプライしました！"
        redirect_to request.referer
      end

      def destroy
        @reply = Reply.find(params[:id])
        @reply.destroy
        flash[:warning] = "リプライを削除しました．"
        redirect_to request.referer
      end

      private

      def reply_params
        params.require(:reply).permit(:reply).merge(user_id: current_user.id, post_id: params[:post_id])
      end
    end
  end
end
