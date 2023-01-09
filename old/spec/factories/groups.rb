FactoryBot.define do
  factory :group do
    group_name { "MyString" }
    group_avatar { Rack::Test::UploadedFile.new(Rails.root.join("spec/fixtures/4MB_dummy.jpg"), "image/jpeg") }
  end
end
