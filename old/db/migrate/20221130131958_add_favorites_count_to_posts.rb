class AddFavoritesCountToPosts < ActiveRecord::Migration[6.1]
  def self.up
    add_column :posts, :favorites_count, :integer, null: false, default: 0
  end

  def self.down
    remove_column :posts, :favorites_count
  end
end
