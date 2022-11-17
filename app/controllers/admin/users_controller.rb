class Admin::UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      flash[:notice] = "ユーザー名「#{@user.user_name}」を登録しました．"
      redirect_to admin_users_path
    else
      render new_admin_user_path
    end
  end

  private

  def user_params
    params.require(:user).permit(:user_name, :email, :password, :password_confirmation, :user_profile, :admin, :guest)
  end
end
