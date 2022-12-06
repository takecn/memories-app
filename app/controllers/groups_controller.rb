class GroupsController < ApplicationController
  before_action :group_user?, except: [:new, :index]

  def index
    @groups = Group.preload(:users, group_avatar_attachment: :blob)
  end

  def new
    @group = Group.new
    @users = User.all
  end

  def create
    @group = Group.new(group_params)
    @users = User.all
    if @group.save
      flash[:success] = "グループ「#{@group.group_name}」を作成しました．"
      redirect_to group_path(@group.id)
    else
      flash.now[:danger] = "グループを作成できませんでした．"
      render :new
    end
  end

  def show
    @group = Group.preload(:users, group_avatar_attachment: :blob).find(params[:id])
    @users = User.all
  end

  def edit
    @group = Group.find(params[:id])
  end

  def update
    @group = Group.find(params[:id])
    if @group.update(group_params)
      flash[:success] = "「#{@group.group_name}」を更新しました．"
      redirect_to group_path(@group.id)
    else
      flash.now[:danger] = "グループを更新できませんでした．"
      render :edit
    end
  end

  private

  def group_params
    params.require(:group).permit(:group_name, :group_profile, :group_avatar, :user_id, user_ids: [])
  end

  def group_user?
    group = Group.find(params[:id])
    group.group_users.where(user_id: current_user.id)
  end
end
