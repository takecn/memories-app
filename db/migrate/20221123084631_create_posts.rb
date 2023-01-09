class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts do |t|
      t.integer :user_id
      t.integer :map_id
      t.string :comment
      t.date :memorized_on
      t.string :disclosure_range
      t.text :description

      t.timestamps
    end
  end
end
