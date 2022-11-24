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

  def guest_login
    user = User.find_by(id: 25, user_name: "guest1", email: "guest1@guest.com", guest: true)
    if user.present?
      session[:user_id] = user.id
      flash[:success] = "「#{user.user_name}」でログインしました．"
      redirect_to root_path
    else
      password = SecureRandom.urlsafe_base64
      user = User.new(id: 25, user_name: "guest1", email: "guest1@guest.com", guest: true, password: password, password_confirmation: password)
      if user.save
        session[:user_id] = user.id
        flash[:success] = "「#{user.user_name}」を作成しログインしました．"
        redirect_to root_path
      else
        flash[:danger] = "ゲストユーザーを作成できませんでした．id, user_name, emailが既存アカウントと重複している可能性があります．"
        redirect_to login_path
      end
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
