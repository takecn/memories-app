class CreateNotices < ActiveRecord::Migration[6.1]
  def change
    create_table :notices do |t|
      t.integer :sender_id
      t.integer :receiver_id
      t.integer :post_id
      t.integer :favorite_id
      t.integer :reply_id
      t.integer :group_user_id
      t.string :notice_factor
      t.boolean :checked, default: false, null: false

      t.timestamps
    end
  end
end
