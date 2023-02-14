class AddGroupIdToNotices < ActiveRecord::Migration[6.1]
  def change
    add_column :notices, :group_id, :integer
  end
end
