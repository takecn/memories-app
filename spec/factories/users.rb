FactoryBot.define do
  factory :user do
    user_name { "MyString" }
    email { "MyString" }
    password_digest { "MyString" }
    user_profile { "MyText" }
    admin { false }
    guest { false }
  end
end
