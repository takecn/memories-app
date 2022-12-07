class NoticesController < ApplicationController
  def index
    @notices = current_user.passive_notices.preload(:sender).where.not(sender_id: current_user.id).order(id: :DESC)
  end
end
