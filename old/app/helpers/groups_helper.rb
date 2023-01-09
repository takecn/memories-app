module GroupsHelper
  def group_user(group, user)
    GroupUser.find_by(group_id: group.id, user_id: user.id)
  end
end
