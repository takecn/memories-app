FactoryBot.define do
  factory :reply do
    user_id { 1 }
    post_id { 1 }
    reply { "MyString" }
  end
end
