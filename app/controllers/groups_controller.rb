class GroupsController < ApplicationController
  before_action :group_user?, except: [:new, :create, :index]

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

    if @group.save # post保存時に，collection_check_boxesメソッドによりgroup_usersテーブルのレコードが生成．

      # グループ作成者(group_founder)をデフォルトでグループの所属メンバーにする．
      group_founder = GroupUser.find_by(group_id: @group.id, user_id: current_user.id)
      group_founder.update(accepted: true)

      # group_userの作成に合わせて通知を発行する．
      @group_users = GroupUser.where(group_id: @group.id)
      @group.create_group_invitation_notice(@group_users, current_user)

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
    group_user = group.group_users.find_by(group_id: group.id, user_id: current_user.id)
    redirect_to groups_path if group_user.blank?
  end
end
