class NoticesController < ApplicationController
  def index
    @notices = current_user.passive_notices.preload(:sender, :group).where.not(sender_id: current_user.id).order(id: :DESC)
  end

  def update
    notice = Notice.find(params[:id])
    notice.update(checked: params[:checked])
    redirect_to notices_path
  end
end
