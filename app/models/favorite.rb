class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :post, counter_cache: true

  validates_uniqueness_of :post_id, scope: :user_id
end
