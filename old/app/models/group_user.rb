class GroupUser < ApplicationRecord
  belongs_to :group
  belongs_to :user
  has_one :notice, dependent: :destroy
end
