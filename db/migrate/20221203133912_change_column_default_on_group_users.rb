class ChangeColumnDefaultOnGroupUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_default :group_users, :accepted, from: nil, to: false
  end
end
