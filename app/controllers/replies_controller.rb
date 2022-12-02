class RepliesController < ApplicationController
  def create
    @reply = Reply.create(reply_params)
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
