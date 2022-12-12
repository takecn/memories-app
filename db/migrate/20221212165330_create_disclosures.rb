class CreateDisclosures < ActiveRecord::Migration[6.1]
  def change
    create_table :disclosures do |t|
      t.integer :post_id
      t.integer :group_id

      t.timestamps
    end
  end
end
