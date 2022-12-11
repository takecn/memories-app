class Map < ApplicationRecord
  has_many :posts
  geocoded_by :location
  after_validation :geocode
end
