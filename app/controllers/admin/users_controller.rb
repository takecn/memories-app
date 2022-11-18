class Admin::UsersController < ApplicationController
  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      flash[:success] = "アカウント「#{@user.user_name}」を登録しました．"
      redirect_to admin_users_path
    else
      flash.now[:danger] = "アカウント登録できませんでした．"
      render :new
    end
  end

  def show
    @user = User.find(params[:id])
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      flash[:success] = "アカウント「#{@user.user_name}」を更新しました．"
      redirect_to admin_user_path(@user.id)
    else
      flash.now[:danger] = "アカウント更新できませんでした．"
      render :show
    end
  end

  def destroy
    @user = User.find(params[:id])
    @user.destroy
    flash[:success] = "アカウント「#{@user.user_name}」を削除しました．"
    redirect_to admin_users_path
  end

  private

  def user_params
    params.require(:user).permit(:user_name, :email, :password, :password_confirmation, :user_profile, :admin, :guest)
  end
end
