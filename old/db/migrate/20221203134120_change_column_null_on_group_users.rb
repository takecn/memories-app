class ChangeColumnNullOnGroupUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_null :group_users, :accepted, false
  end
end
