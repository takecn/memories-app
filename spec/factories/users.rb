FactoryBot.define do
  factory :user do
    sequence(:user_name) { |n| "user_name#{n}" }
    sequence(:email) { |n| "user_name#{n}@example.com" }
    password_digest { "MyString" }
    password_confirmation { "MyString" }
    user_avatar { Rack::Test::UploadedFile.new(Rails.root.join("spec/fixtures/4MB_dummy.jpg"), "image/jpeg") }
  end
end
