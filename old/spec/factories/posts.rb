FactoryBot.define do
  factory :post do
    post_images { Rack::Test::UploadedFile.new(Rails.root.join("spec/fixtures/4MB_dummy.jpg")) }
    user
    map
  end
end
