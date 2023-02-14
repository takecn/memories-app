class ApplicationController < ActionController::API
  include ActionController::Cookies

  helper_method :current_user
  #! before_action :login_required # 一時的にコメントアウト

  private

  def current_user
    if session[:user_id]
      @current_user ||= User.find_by(id: session[:user_id])
    elsif cookies.encrypted[:user_id]
      @current_user ||= User.find_by(id: cookies.encrypted[:user_id])
      session[:user_id] = @current_user.id
    end
  end

  #! session.jsを通して，SessionProvider.jsxのsessionStatusを維持する．
  # def login_required
  #   unless current_user
  #     render json: { redirect_url: "/api/v1/guest_login" }, status: :unauthorized
  #   end
  # end
  def login_required
    redirect_to login_path unless current_user
  end
end
