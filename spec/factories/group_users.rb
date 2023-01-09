FactoryBot.define do
  factory :group_user do
    user_id { 1 }
    group_id { 1 }
    accepted { false }
  end
end
