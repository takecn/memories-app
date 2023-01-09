class AddIndexToGroupName < ActiveRecord::Migration[6.1]
  def change
    add_index :groups, :group_name, unique: true
  end
end
