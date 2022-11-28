class Post < ApplicationRecord
  has_many_attached :post_images
  belongs_to :user
end
