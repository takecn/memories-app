class Notice < ApplicationRecord
  belongs_to :favorite, optional: true
  belongs_to :sender, class_name: "User", optional: true
  belongs_to :receiver, class_name: "User", optional: true
end
