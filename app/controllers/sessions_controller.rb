class SessionsController < ApplicationController
  skip_before_action :login_required

  def new
    @session = Session.new
  end

  def create
    @session = Session.new
    @session.valid?
    user = User.find_by(email: session_params[:email])
    if user&.authenticate(session_params[:password])
      session[:user_id] = user.id
      flash[:success] = "「#{user.user_name}」でログインしました．"
      redirect_to root_path
    else
      flash.now[:danger] = "ログインできませんでした．"
      render :new
    end
  end

  def destroy
    reset_session
    flash[:success] = "ログアウトしました．"
    redirect_to login_path
  end

  private

  def session_params
    params.require(:session).permit(:user_name, :email, :password, :password_confirmation)
  end
end
