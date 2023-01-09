class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :user_name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.text :user_profile
      t.boolean :admin, default: false, null: false
      t.boolean :guest, default: false, null: false

      t.timestamps
      t.index :user_name, unique: true
      t.index :email, unique: true
    end
  end
end
