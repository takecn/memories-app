class Notice < ApplicationRecord
  belongs_to :sender, class_name: "User", optional: true
  belongs_to :receiver, class_name: "User", optional: true
  belongs_to :post, optional: true
  belongs_to :favorite, optional: true
  belongs_to :reply, optional: true
  belongs_to :group, optional: true
  belongs_to :group_user, optional: true
end
