class GroupUsersController < ApplicationController
  def create
    @group_user = GroupUser.create(group_id: params[:group_id], user_id: params[:user_id], accepted: params[:accepted])
    @user = @group_user.user
    @group = @group_user.group
    flash[:success] = "「#{@user.user_name}」を「#{@group.group_name}」に招待しました．"
    redirect_to request.referer
  end

  def update
    @group_user = GroupUser.find_by(group_id: params[:group_id], user_id: current_user.id)
    @group_user.update(group_id: params[:group_id], user_id: current_user.id, accepted: params[:accepted])
    @group = @group_user.group
    flash[:success] = "グループ「#{@group.group_name}」に参加しました！"
    redirect_to request.referer
  end

  def destroy
    @group_user = GroupUser.find(params[:id])
    @user = @group_user.user
    @group = @group_user.group
    @group_user.destroy
    flash[:success] = "「#{@user.user_name}」を「#{@group.group_name}」から削除しました．"
    redirect_to request.referer
  end
end
