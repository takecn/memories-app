module ApplicationHelper
  # 未読の通知レコードを取得するメソッド
  def unchecked_notices
    current_user.passive_notices.where(checked: false).where.not(sender_id: current_user.id)
  end
end
