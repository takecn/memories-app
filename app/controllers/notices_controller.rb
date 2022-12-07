class NoticesController < ApplicationController
  def index
    @notices = current_user.passive_notices.preload(:sender)
  end
end
