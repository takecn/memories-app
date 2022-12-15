class GroupUsersController < ApplicationController
  def create # Group詳細画面で「その他ユーザー」からユーザー選択しレコードを生成．
    @group_user = GroupUser.create(group_id: params[:group_id], user_id: params[:user_id], accepted: params[:accepted])
    flash[:success] = "「#{@group_user.user.user_name}」を「#{@group_user.group.group_name}」に招待しました．"
    redirect_to request.referer
  end

  def update
    @group_user = GroupUser.find_by(group_id: params[:group_id], user_id: current_user.id)
    @group_user.update(group_id: params[:group_id], user_id: current_user.id, accepted: params[:accepted])
    flash[:success] = "グループ「#{@group_user.group.group_name}」に参加しました！"
    redirect_to request.referer
  end

  def destroy
    @group_user = GroupUser.find(params[:id])
    @group_user.destroy
    flash[:success] = "「#{@group_user.user.user_name}」を「#{@group_user.group.group_name}」から削除しました．"
    if @group_user.user_id == current_user.id
      redirect_to groups_path
    else
      redirect_to request.referer
    end
  end
end
