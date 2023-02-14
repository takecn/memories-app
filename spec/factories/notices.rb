FactoryBot.define do
  factory :notice do
    sender_id { 1 }
    receiver_id { 1 }
    post_id { 1 }
    favorite_id { 1 }
    reply_id { 1 }
    group_user_id { 1 }
    notice_factor { "MyString" }
    checked { false }
  end
end
