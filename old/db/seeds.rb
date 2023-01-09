5.times do |n|
  user = User.new(
    user_name: "testユーザー_#{n}",
    email: "test#{n}@example.com",
    password_digest: "testパスワード_#{n}",
    user_profile: "testプロフィール_#{n}",
    admin: true,
    guest: true,
    created_at: "2023-01-06 21:18:57",
    updated_at: "2023-01-06 21:18:57",
  )
  user.save!
end
