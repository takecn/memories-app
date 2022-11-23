FactoryBot.define do
  factory :post do
    user_id { 1 }
    map_id { 1 }
    comment { "MyString" }
    memorized_on { "2022-11-23" }
    disclosure_range { "MyString" }
    description { "MyText" }
  end
end
